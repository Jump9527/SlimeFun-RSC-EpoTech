let usageCount = 0;

const stoneUsageIncrement = {
  [org.bukkit.Material.COBBLESTONE]: 1,
  [org.bukkit.Material.STONE]: 2,
};//你可以自定义添加挖掘的物品及增加的点数

const oreTypes = {
  "§4§lShift + 右键切换模式 : §2§l 钻石": org.bukkit.Material.DIAMOND,
  "§4§lShift + 右键切换模式 : §2§l 绿宝石": org.bukkit.Material.EMERALD,
  "§4§lShift + 右键切换模式 : §2§l 下届合金锭": org.bukkit.Material.NETHERITE_INGOT,
  "§4§lShift + 右键切换模式 : §2§l 石英": org.bukkit.Material.QUARTZ,
  "§4§lShift + 右键切换模式 : §2§l 青金石": org.bukkit.Material.LAPIS_LAZULI,
  "§4§lShift + 右键切换模式 : §2§l 红石": org.bukkit.Material.REDSTONE,
  "§4§lShift + 右键切换模式 : §2§l 铁锭": org.bukkit.Material.IRON_INGOT,
  "§4§lShift + 右键切换模式 : §2§l 金锭": org.bukkit.Material.GOLD_INGOT,
  "§4§lShift + 右键切换模式 : §2§l 铜锭": org.bukkit.Material.COPPER_INGOT,
};//你可以自定义添加需要切换的模式

const oreCounts = {
  [org.bukkit.Material.DIAMOND]: 100,
  [org.bukkit.Material.EMERALD]: 70,
  [org.bukkit.Material.NETHERITE_INGOT]: 150,
  [org.bukkit.Material.QUARTZ]: 20,
  [org.bukkit.Material.LAPIS_LAZULI]: 10,
  [org.bukkit.Material.REDSTONE]: 10,
  [org.bukkit.Material.IRON_INGOT]: 20,
  [org.bukkit.Material.GOLD_INGOT]: 20,
  [org.bukkit.Material.COPPER_INGOT]: 10,
};//你可以自定义添加需要兑换的物品及需要的点数

function onUse(event) {
  let player = event.getPlayer();
  if (player.isSneaking()) {
    updateLore(event);
  } else {
    giveItem(event);
  }
}

function onToolUse(event, item) {
  let block = event.getBlock();
  let blockType = block.getType();
  if (stoneUsageIncrement.hasOwnProperty(blockType)) {
    usageCount += stoneUsageIncrement[blockType];
    updateUsageCount(item);
  }
}

function updateLore(event) {
  let player = event.getPlayer();
  let item = event.getItem();
  let itemMeta = item.getItemMeta();
  let lore = itemMeta.getLore() || [];
  let newLore = lore.map((length) => {
    let newType = getNextOreType(length);
    if (newType) {
      sendMessage(player, `成功更改为 ${newType.replace("§4§lShift + 右键切换模式 : §2§l ", "")}`);
      return newType;
    }
    return length;
  });
  itemMeta.setLore(newLore);
  item.setItemMeta(itemMeta);
}

function getNextOreType(currentType) {
  let keys = Object.keys(oreTypes);
  let index = keys.indexOf(currentType);
  if (index === -1) return null;
  return keys[(index + 1) % keys.length];
}

function giveItem(event) {
  let player = event.getPlayer();
  let item = event.getItem();
  let itemMeta = item.getItemMeta();
  let lore = itemMeta.getLore() || [];
  let newLore = lore.map((length) => {
    if (oreTypes[length]) {
      giveOre(player, oreTypes[length], event);
      return length;
    }
    return length;
  });
}

function giveOre(player, oreType, event) {
  if (usageCount < oreCounts[oreType]) {
    player.sendMessage("存储数量不足");
    return;
  }
  let amount = Math.floor(usageCount / oreCounts[oreType]);
  let maxStack = 64;
  let totalStacks = Math.floor(amount / maxStack);
  let remainder = amount % maxStack;
  let inv = player.getInventory();

  for (let i = 0; i < totalStacks; i++) {
    let added = inv.addItem(new org.bukkit.inventory.ItemStack(oreType, maxStack));
    if (!added.isEmpty()) {
      player.getWorld().dropItemNaturally(player.getLocation(), added.get(0));
      player.sendMessage("背包已满，物品已掉落在地面上");
    }
  }

  if (remainder > 0) {
    let added = inv.addItem(new org.bukkit.inventory.ItemStack(oreType, remainder));
    if (!added.isEmpty()) {
      player.getWorld().dropItemNaturally(player.getLocation(), added.get(0));
    }
  }
  usageCount -= amount * oreCounts[oreType];
  updateUsageCount(event.getItem());

  let totalGiven = totalStacks * maxStack + remainder;
  player.sendMessage(`你获得了: ${totalGiven} ${oreType.name()}`);
}

function updateUsageCount(item) {
  let itemMeta = item.getItemMeta();
  let lore = itemMeta.getLore() != null ? itemMeta.getLore().slice(0, 1) : [];
  lore.push("§x§c§2§2§a§f§b存储数量: " + "§2§l" + usageCount);
  itemMeta.setLore(lore);
  item.setItemMeta(itemMeta);
}