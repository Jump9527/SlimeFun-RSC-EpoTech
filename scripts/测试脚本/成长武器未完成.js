function onWeaponHit(event, player, item) {
    // 验证物品
    if (!isValidWeapon(item)) {
        player.sendMessage("§c主手请持指定武器");
        return;
    }

    // 获取基础数据
    let damageDealt = event.getDamage();
    let itemMeta = item.getItemMeta();
    let lore = itemMeta.getLore() || []; // 处理null值
    
    // 更新剩余伤害值
    let { newLore, shouldUpgrade } = updateDamageCounter(lore, damageDealt);
    itemMeta.setLore(newLore);
    
    // 伤害达标时升级武器
    if (shouldUpgrade) {
        upgradeWeaponDamage(itemMeta, player);
    }
    
    item.setItemMeta(itemMeta);
}

// 验证是否为指定武器
function isValidWeapon(item) {
    let sfItem = getSfItemByItem(item);
    return "JP_CSWQ" === sfItem.getId();
}

// 更新伤害计数器
function updateDamageCounter(lore, damageDealt) {
    let MAX_DAMAGE = 10;
    let shouldUpgrade = false;
    
    let newLore = lore.map(line => {
        if (!line.includes("剩余伤害:")) return line;
        
        let current = parseInt(line.replace(/[^0-9]/g, '')) || 0;
        let remaining = Math.max(0, current - damageDealt);
        
        if (remaining <= 0) {
            shouldUpgrade = true;
            remaining = MAX_DAMAGE; // 重置计数器
        }
        
        return line.replace(/剩余伤害: \d+/, `剩余伤害: ${remaining}`);
    });
    
    return { newLore, shouldUpgrade };
}

// 提升武器伤害
function upgradeWeaponDamage(itemMeta, player) {
    let ATTRIBUTE = org.bukkit.attribute.Attribute.GENERIC_ATTACK_DAMAGE;
    let SLOT = org.bukkit.inventory.EquipmentSlot.HAND;
    
    // 获取当前最大伤害值
    let modifiers = itemMeta.getAttributeModifiers(ATTRIBUTE);
    let currentDamage = modifiers ? getMaxDamageAmount(modifiers) : 0;
    let newDamage = currentDamage + 1;
    
    // 更新属性
    itemMeta.removeAttributeModifier(ATTRIBUTE); // 移除旧属性
    itemMeta.addAttributeModifier(ATTRIBUTE, createDamageModifier(newDamage, SLOT));
    
    player.sendMessage(`§a武器伤害+1 (当前: ${newDamage})！剩余伤害重置为2000`);
}

// 创建伤害修饰符
function createDamageModifier(amount, slot) {
    return new org.bukkit.attribute.AttributeModifier(
        java.util.UUID.randomUUID(),
        "damage_upgrade",
        amount,
        org.bukkit.attribute.AttributeModifier.Operation.ADD_NUMBER,
        slot
    );
}

// 获取最大伤害值
function getMaxDamageAmount(modifiers) {
    let max = 0;
    let iterator = modifiers.iterator();
    while (iterator.hasNext()) {
        let amount = iterator.next().getAmount();
        if (amount > max) max = amount;
    }
    return max;
}