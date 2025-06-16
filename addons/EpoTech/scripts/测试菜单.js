var Consumer = Java.type('java.util.function.Consumer');
var Material = Java.type('org.bukkit.Material');

function onClick(player, slot) {
  if (slot === 49) {
    const inv = player.getOpenInventory().getTopInventory();
    let location = inv.getHolder().getLocation();
    if (!location) {
      return;
    }
    player.sendMessage("§a请在聊天中输入数字(输入cancel取消):");

    var JSConsumer = Java.extend(Consumer, {
      accept: function(input) {
        if (input.toLowerCase() === "cancel") {
          player.sendMessage("§a已取消输入");
          return;
        }
        
        // 验证输入是否为数字
        if (!/^\d+$/.test(input)) {
          player.sendMessage("§c请输入有效的数字！");
          return;
        }
        var inputNumber = parseInt(input);
        
        // 检查物品
        for (let index = 0; index < inv.getSize(); index++) {
          let item = inv.getItem(index);
          if (item && item.getType() === Material.COBBLESTONE) {
            var meta = item.getItemMeta();
            if (meta && meta.hasDisplayName()) {
              var name = meta.getDisplayName();
              // 从物品名称中提取数字
              var match = name.match(/\d+/);
              if (match) {
                var itemNumber = parseInt(match[0]);
                if (itemNumber === inputNumber) {
                  player.sendMessage("§a数字匹配！");
                  
                  let b = StorageCacheUtils.getSfItem(location);
                  let charge = b.getCharge(location);
                  player.sendMessage("当前能量: " + charge);
                  return;
                }
              }
            }
          }
        }
        player.sendMessage("§c没有找到匹配的数字！");
      }
    });

    // 这里需要实现获取玩家输入的逻辑
    // 例如使用某个插件的getChatInput方法：
    getChatInput(player, new JSConsumer());
  }
}