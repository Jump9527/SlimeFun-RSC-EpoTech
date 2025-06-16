var Consumer = Java.type('java.util.function.Consumer');
var Material = Java.type('org.bukkit.Material');
var ItemStack = Java.type('org.bukkit.inventory.ItemStack');
var ItemMeta = Java.type('org.bukkit.inventory.meta.ItemMeta');

function onClick(player, slot) {
  if (slot === 49) {
    let inv = player.getOpenInventory().getTopInventory();
    let location = inv.getHolder().getLocation();
    if (!location) {
      return;
    }

    // 检查容器中是否有圆石
    let cobbleCount = 0;
    for (let i = 0; i < inv.getSize(); i++) {
      let item = inv.getItem(i);
      if (item && item.getType() === Material.COBBLESTONE) {
        cobbleCount++;
      }
    }
    
    // 如果圆石数量不足2个，先清除所有圆石再生成2个新的
    if (cobbleCount < 2) {
      clearAllCobblestone(inv);
      generateRandomCobblestones(inv);
    }

    player.sendMessage("§a请输入两个圆石数字的乘积(输入cancel取消):");
    player.closeInventory();

    let JSConsumer = Java.extend(Consumer, {
      accept: function(input) {
        if (input.toLowerCase() === "cancel") {
          player.sendMessage("§a已取消输入");
          return;
        }
        
        // 验证输入是否为数字
        if (!/^\d+$/.test(input)) {
          player.sendMessage("§c请输入有效的整数！");
          return;
        }
    
        // 收集所有圆石的数字
        let cobbleNumbers = [];
        for (let index = 0; index < inv.getSize(); index++) {
          let item = inv.getItem(index);
          if (item && item.getType() === Material.COBBLESTONE) {
            let meta = item.getItemMeta();
            if (meta && meta.hasDisplayName()) {
              let name = meta.getDisplayName();
              let match = name.match(/\d+/);
              if (match) {
                cobbleNumbers.push(parseInt(match[0]));
              }
            }
          }
        }
        
        // 检查是否有两个圆石且乘积匹配
        let found = false;
        let product = 0;
        if (cobbleNumbers.length === 2) {
          product = cobbleNumbers[0] * cobbleNumbers[1];
          if (product == input) {
            found = true;
          }
        }
        
        if (found) {
          player.sendMessage("§a发电成功 " + product);
          let machine = StorageCacheUtils.getSfItem(location);
          machine.addCharge(location, product);
          
          let charge = machine.getCharge(location);
          player.sendMessage("当前能量: " + charge);
          
          // 成功匹配后重新生成圆石
          clearAllCobblestone(inv);
          generateRandomCobblestones(inv);
        } else {
          player.sendMessage("§c发电失败,答案错误！");
          if (cobbleNumbers.length === 2) {
            player.sendMessage("§e提示: " + cobbleNumbers[0] + " × " + cobbleNumbers[1] + " = " + (cobbleNumbers[0] * cobbleNumbers[1]));
          }
        }
      }
    });

    getChatInput(player, new JSConsumer());
  }
}

// 生成2个随机位置的圆石（排除49号槽位，范围0-53）
function generateRandomCobblestones(inv) {
  let size = inv.getSize();
  
  // 先收集所有可用的空槽位（排除49）
  let availableSlots = [];
  for (let i = 0; i < size; i++) {
    if (i !== 49 && 
        (inv.getItem(i) === null || 
         (inv.getItem(i) && inv.getItem(i).getType() === Material.AIR))) {
      availableSlots.push(i);
    }
  }
  
  // 如果可用槽位不足2个，直接返回
  if (availableSlots.length < 2) {
    return;
  }
  
  // 随机打乱可用槽位数组
  availableSlots = shuffleArray(availableSlots);
  
  // 取前两个位置生成圆石
  for (let j = 0; j < 2 && j < availableSlots.length; j++) {
    let pos = availableSlots[j];
    let cobble = new ItemStack(Material.COBBLESTONE, 1);
    let meta = cobble.getItemMeta();
    let randomNum = Math.floor(Math.random() * 100) + 1; // 1-100的随机数
    meta.setDisplayName(randomNum.toString());
    cobble.setItemMeta(meta);
    inv.setItem(pos, cobble);
  }
}

// 打乱数组
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 清空所有圆石
function clearAllCobblestone(inv) {
  for (let i = 0; i < inv.getSize(); i++) {
    let item = inv.getItem(i);
    if (item && item.getType() === Material.COBBLESTONE) {
      inv.setItem(i, null);
    }
  }
}