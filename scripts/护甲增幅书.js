function onUse(event) {
  let player = event.getPlayer();
  if (event.getHand() !== org.bukkit.inventory.EquipmentSlot.HAND) {
    player.sendMessage("主手请持增幅书");
    return;
  }

  if (player.isSneaking()) {
    updateLore(event);
  } else {
    upgradeArmor(event);
  }
}

function updateLore(event) {
  let player = event.getPlayer();
  let item = event.getItem();
  let itemMeta = item.getItemMeta();
  let lore = itemMeta.getLore() || [];
  let newLore = lore.map((length) => {
    switch (length) {
      case "§4§lShift + 右键切换模式 : §2§l 头盔": player.sendMessage("更改成功"); return "§4§lShift + 右键切换模式 : §2§l 胸甲";
      case "§4§lShift + 右键切换模式 : §2§l 胸甲": player.sendMessage("更改成功"); return "§4§lShift + 右键切换模式 : §2§l 护腿";
      case "§4§lShift + 右键切换模式 : §2§l 护腿": player.sendMessage("更改成功"); return "§4§lShift + 右键切换模式 : §2§l 鞋子";
      case "§4§lShift + 右键切换模式 : §2§l 鞋子": player.sendMessage("更改成功"); return "§4§lShift + 右键切换模式 : §2§l 头盔";
      default: return length;
    }
  });
  itemMeta.setLore(newLore);
  item.setItemMeta(itemMeta);
}

function upgradeArmor(event) {
  let player = event.getPlayer();
  let item = event.getItem();
  let itemMeta = item.getItemMeta();
  let lore = itemMeta.getLore() || [];
  let newLore = lore.map((length) => {
    switch (length) {
      case "§4§lShift + 右键切换模式 : §2§l 头盔": case "§4§lShift + 右键切换模式 : §2§l 胸甲": case "§4§lShift + 右键切换模式 : §2§l 护腿": case "§4§lShift + 右键切换模式 : §2§l 鞋子":
        upgradeEquipment(player, getEquipmentSlot(length), event);
        return length;
      default:
        return length;
    }
  });
  itemMeta.setLore(newLore);
  item.setItemMeta(itemMeta);
}

function getEquipmentSlot(length) {
  switch (length) {
    case "§4§lShift + 右键切换模式 : §2§l 头盔": return org.bukkit.inventory.EquipmentSlot.HEAD;
    case "§4§lShift + 右键切换模式 : §2§l 胸甲": return org.bukkit.inventory.EquipmentSlot.CHEST;
    case "§4§lShift + 右键切换模式 : §2§l 护腿": return org.bukkit.inventory.EquipmentSlot.LEGS;
    case "§4§lShift + 右键切换模式 : §2§l 鞋子": return org.bukkit.inventory.EquipmentSlot.FEET;
    default: return null;
  }
}

function upgradeEquipment(player, equipmentType, event) {
  let equipment = player.getInventory().getItem(equipmentType);
  if (!equipment || !(equipment.getItemMeta() instanceof org.bukkit.inventory.meta.ArmorMeta)) {
    player.sendMessage("请带在" + equipmentType.toString().toLowerCase() + "上穿戴装备");
    return;
  }

  let itemMeta = equipment.getItemMeta();
  let attributeModifiers = itemMeta.getAttributeModifiers(org.bukkit.attribute.Attribute.GENERIC_ARMOR);
  decrementItemAmount(event.getItem());
  if (attributeModifiers == null || attributeModifiers.isEmpty()) {
    addArmorAttribute(itemMeta, equipmentType);
    player.sendMessage("强化成功！装备防御已增加。");
  } else {
    let maxAmount = getMaxDamageAmount(attributeModifiers);
    let upgradeChance = calculateUpgradeChance(maxAmount);
    let randomChance = Math.random();
    if (randomChance < upgradeChance) {
      updateArmorAttribute(itemMeta, equipmentType, maxAmount + 1);
      player.sendMessage("强化成功！装备防御已增加。");
    } else {
      player.getInventory().setItem(equipmentType, null);
      player.sendMessage("强化失败！装备已销毁。");
    }
  }
  equipment.setItemMeta(itemMeta);
}

function addArmorAttribute(itemMeta, slot) {
  let newModifier = new org.bukkit.attribute.AttributeModifier(
    java.util.UUID.randomUUID(),
    "护甲",
    1,
    org.bukkit.attribute.AttributeModifier.Operation.ADD_NUMBER,
    slot
  );
  itemMeta.addAttributeModifier(org.bukkit.attribute.Attribute.GENERIC_ARMOR, newModifier);
}

function updateArmorAttribute(itemMeta, slot, amount) {
  let newModifier = new org.bukkit.attribute.AttributeModifier(
    java.util.UUID.randomUUID(),
    "护甲",
    amount,
    org.bukkit.attribute.AttributeModifier.Operation.ADD_NUMBER,
    slot
  );
  itemMeta.removeAttributeModifier(org.bukkit.attribute.Attribute.GENERIC_ARMOR);
  itemMeta.addAttributeModifier(org.bukkit.attribute.Attribute.GENERIC_ARMOR, newModifier);
}

function getMaxDamageAmount(modifiers) {
  return modifiers.reduce((max, modifier) => Math.max(max, modifier.getAmount()), 0);
}

function calculateUpgradeChance(level) {
  let baseChance = 1.0;
  let decreasePerTenLevels = 0.01;
  level = Math.floor(level / 10);
  while (level-- > 0) {
    baseChance -= decreasePerTenLevels;
  }
  return baseChance;
}

function decrementItemAmount(item) {
  if (item && item.getAmount() > 1) {
    item.setAmount(item.getAmount() - 1);
  } else if (item) {
    item.setAmount(0);
  }
}