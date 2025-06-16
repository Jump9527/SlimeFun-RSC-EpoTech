// 全局变量存储配置
var mobDropsConfig = {};

function onWeaponHit(event, player, item) {
    let target = event.getEntity();

    if (target instanceof org.bukkit.entity.LivingEntity) {
        let damage = event.getFinalDamage();
        let remainingHealth = target.getHealth() - damage;

        if (remainingHealth <= 0) {
            customMobDropByCustomWeapon(player, target);
        } 
    }
}

function customMobDropByCustomWeapon(player, entity) {
    // 从配置中获取掉落信息
    let entityType = entity.getType().toString();
    let config = getAddonConfig();
    mobDropsConfig = config.getConfigurationSection("mob-drops").getValues(false);
    let entityDrops = mobDropsConfig[entityType];
    
    if (!entityDrops) return;

    let location = entity.getLocation();
    let world = entity.getWorld();

    entityDrops.forEach(drop => {
        if (Math.random() * 100 <= drop.probability) {
            let slimefunItem = getSfItemById(drop.item);
            if (slimefunItem) {
                world.dropItemNaturally(location, slimefunItem.getItem().clone());
            }
        }
    });
}