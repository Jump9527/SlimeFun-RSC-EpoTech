
//概率
function chanceEvent(chance) {
  if (typeof chance !== 'number' || chance < 0 || chance > 1) {
    throw new Error('概率值应该在0到1之间。');
  }
  return Math.random() < chance;
}

//获取手中物品粘液id并进行对比
function handleItemInMainHand(player, slimefunItemId) {
  let itemInMainHand = player.getInventory().getItemInMainHand();
  let sfItem = getSfItemByItem(itemInMainHand);
  if (sfItem !== null) {
    return slimefunItemId === sfItem.getId();
  } else {
    return false;
  }
}

//自定义标签怪物掉落
function zidingyiguaiwu(event,killer) {
  const levels = [
    { item: "JP_JH_1", probability: 50 },
    { item: "JP_JH_2", probability: 50 },
    { item: "JP_JH_3", probability: 50 },
    { item: "JP_JH_4", probability: 50 },
    { item: "JP_JH_5", probability: 50 },
    { item: "JP_JH_6", probability: 50 }
  ];

  const customNames = event.getScoreboardTags();
  let levelIndex = -1;

  // 根据自定义标签确定索引
  customNames.forEach((tag) => {
    if (tag === "一级怪物") levelIndex = 0;
    else if (tag === "二级怪物") levelIndex = 1;
    else if (tag === "三级怪物") levelIndex = 2;
    else if (tag === "四级怪物") levelIndex = 3;
    else if (tag === "五级怪物") levelIndex = 4;
    else if (tag === "世界boss") levelIndex = 5;
  });

  // 如果找到有效的索引
  if (levelIndex !== -1) {
    const level = levels[levelIndex];
    const slimefunItem = getSfItemById(level.item);
    const itemStack = new org.bukkit.inventory.ItemStack(slimefunItem.getItem());
    const location = event.getLocation(); 
    const world = location.getWorld();

    const randomValue = Math.random() * 100; // 生成0到100的随机浮点数
    //killer.sendMessage(randomValue);

    // 直接与单个掉落项的概率比较
    if (randomValue <= level.probability) {
      world.dropItemNaturally(location, itemStack);
    }
  }
}


//自定义武器与怪物掉落
function zidingyiguaiwuByzidingyiwuqi(killer, entity) {
  const drops = [
    { item: "REINFORCED_ALLOY_INGOT", probability: 10 },
    { item: "SYNTHETIC_DIAMOND", probability: 10 },
    { item: "SYNTHETIC_EMERALD", probability: 10 },
    { item: "FERROSILICON", probability: 10 },
    { item: "SYNTHETIC_SAPPHIRE", probability: 10 },
    { item: "CARBONADO", probability: 10 }
  ];

  const entityTypeToDropIndex = {
    [org.bukkit.entity.EntityType.ZOMBIE]: 0,
    [org.bukkit.entity.EntityType.SPIDER]: 1,
    [org.bukkit.entity.EntityType.CREEPER]: 2,
    [org.bukkit.entity.EntityType.SKELETON]: 3,
    [org.bukkit.entity.EntityType.MAGMA_CUBE]: 4,
    [org.bukkit.entity.EntityType.IRON_GOLEM]: 5,
  };

  const dropIndex = entityTypeToDropIndex[entity.getType()];

  if (dropIndex === undefined) return;

  const drop = drops[dropIndex];
  const slimefunItem = getSfItemById(drop.item);
  const itemStack = new org.bukkit.inventory.ItemStack(slimefunItem.getItem());
  const location = entity.getLocation();
  const world = entity.getWorld();

  const randomValue = Math.random() * 100;


  if (randomValue <= drop.probability) {
    world.dropItemNaturally(location, itemStack);
  }
}


//自定义镐子掉落物品
function pickaxeDropItems(player, e) {
  const drops = [
    { item: "REINFORCED_ALLOY_INGOT", probability: 10 ,},
    { item: "SYNTHETIC_DIAMOND", probability: 10 },
    { item: "SYNTHETIC_EMERALD", probability: 10 },
    { item: "FERROSILICON", probability: 10 },
    { item: "SYNTHETIC_SAPPHIRE", probability: 10 },
    { item: "CARBONADO", probability: 10 }
  ];

  const blockTypeToDropIndex = {
    [org.bukkit.Material.ANCIENT_DEBRIS]: 0,
    [org.bukkit.Material.DIAMOND_ORE]: 1,
    [org.bukkit.Material.EMERALD_ORE]: 2,
    [org.bukkit.Material.NETHER_QUARTZ_ORE]: 3,
    [org.bukkit.Material.LAPIS_ORE]: 4,
    [org.bukkit.Material.OBSIDIAN]: 5,
  };

  const block = e.getBlock();
  const blockType = block.getType();
  const dropIndex = blockTypeToDropIndex[blockType];

  if (dropIndex === undefined) return;

  const drop = drops[dropIndex];
  const slimefunItem = getSfItemById(drop.item);
  const itemStack = new org.bukkit.inventory.ItemStack(slimefunItem.getItem());
  const location = block.getLocation();
  const world = block.getWorld();

  const randomValue = Math.random() * 100;
  if (randomValue <= drop.probability) {
    world.dropItemNaturally(location, itemStack);
  }
}


//追踪弓
function targetBow(player, e) {
  let world = player.getWorld();
  let eyeLocation = player.getEyeLocation();
  let direction = eyeLocation.getDirection();
  let startLocation = eyeLocation.clone().subtract(0, 0.8, 0).add(direction);
  let maxDistance = 50;
  let rayTraceResults = world.rayTrace(startLocation, direction, maxDistance, org.bukkit.FluidCollisionMode.ALWAYS, true, 0, null);

  if (rayTraceResults === null) {
    player.sendMessage("未设定追踪目标");
    return;
  }

  let entity = rayTraceResults.getHitEntity();
  if (entity !== null) {
    if ( entity instanceof org.bukkit.entity.Arrow){
      return;
    }
    if (entity instanceof org.bukkit.entity.Player) {
      if (entity.getGameMode() !== org.bukkit.GameMode.SURVIVAL) {
        player.sendMessage("你瞄准的是一位神权玩家");
        return;
      }
    }
    let arrow = e.getProjectile();
    runRepeating((t) => {
      updateArrowDirection(arrow, entity);
      if (arrow.isDead() || arrow.isInBlock()) {
        arrow.remove();
        player.sendMessage("已命中目标");
        t.cancel();
      }
    }, 10, 1);
  } else {
    player.sendMessage("未设定追踪目标");
  }
}


function updateArrowDirection(arrow, targetEntity) {
  let arrowLocation = arrow.getLocation();
  let targetLocation = targetEntity.getLocation().add(0, 0.8, 0).toVector();
  let direction = targetLocation.subtract(arrowLocation.toVector()).normalize();

  // 设置箭的飞行速度

  let multiplier = 0.3;
  arrow.setVelocity(direction.multiply(multiplier));
}


//散射弓
function sanshegong(player, event) {
  let force = event.getForce() * 4; // 力量加倍
  let world = player.getWorld();
  let eyeLocation = player.getEyeLocation();
  let direction = eyeLocation.getDirection();
    for (let i = 0; i < 20; i++) {
      world.spawnArrow(eyeLocation, direction, force, 10);
    }
  
}


function onEntityShootBow(e) {
  let entity = e.getEntity();
  if (entity instanceof org.bukkit.entity.Player) {
    let player = entity;
    if (handleItemInMainHand(player, "JP_SANSHEGONG")) {
      sanshegong(entity, e); // 散射弓
    }
    if (handleItemInMainHand(player, "JP_TARGETBOW")) {
      targetBow(player, e); // 追踪弓
    }
  }
}


function onEntityDeath(e) {
  let entity = e.getEntity();
  let killer = entity.getKiller();

  if (killer instanceof org.bukkit.entity.Player) {

    if (handleItemInMainHand(killer, "JP_HKS_DIAMOND_SWORD")) {
      zidingyiguaiwuByzidingyiwuqi(killer, entity);
    }
  }

  if (entity instanceof org.bukkit.entity.Monster) {
    zidingyiguaiwu(entity,killer); //自定义怪物掉落
  }
}


function onBlockBreak(e) {
  let player = e.getPlayer();

  if (handleItemInMainHand(player, "JP_HKS_PICKAXE")) {
    e.setDropItems(false);
    pickaxeDropItems(player, e);//自定义镐子
  }
}


function onEntityDamageByEntity(e) {

  let entity = e.getEntity();
  
  if (e.getDamager().getScoreboardTags().contains("精液")) {
    console.log("114514");
    if (entity instanceof org.bukkit.entity.Player) {
      entity.setHealth(0);
    }
  }

  if (entity.getScoreboardTags().contains("三级怪物")) {
    let damager = e.getDamager();
  
    // 确保伤害来源是玩家
    if (damager instanceof org.bukkit.entity.Player) {
      let player = damager;
      let world = entity.getWorld();

      // 生成火球
      let Chance = 0.2
      if(chanceEvent(Chance)){
        let direction = player.getLocation().toVector().subtract(entity.getLocation().toVector()).normalize();
        let fireball = world.spawn(entity.getLocation(), org.bukkit.entity.Fireball);
        fireball.setDirection(direction);
        fireball.setYield(5);
        fireball.addScoreboardTag("大火球");
      }
      
      
      // 生成闪电
      let Chance1 = 0.2
      if(chanceEvent(Chance1)){
        let lightningstrike = world.strikeLightningEffect(player.getLocation());
        lightningstrike.addScoreboardTag("闪电10");
      }
    }
  }

  if (e.getDamager().getScoreboardTags().contains("自爆卡车")) {
    let damager = e.getDamager();
    damager.getWorld().createExplosion(damager.getLocation(), 2);
    damager.remove();
  }

  if (entity.getScoreboardTags().contains("四级怪物")) {
    let damager = e.getDamager();
  
    // 确保伤害来源是玩家
    if (damager instanceof org.bukkit.entity.Player) {
      let player = damager;
      let entityworld = entity.getWorld();
      let entitylocation = entity.getLocation();
      let radius = 3; // 半径为3

      //回血技能
      let Chance1 = 0.1
      if(chanceEvent(Chance1) && entity.getMaxHealth()* 0.1 >= entity.getHealth()){
        for (let i = 0; i < 3; i++) {
          let monster = entityworld.spawnEntity(entitylocation, org.bukkit.entity.EntityType.ZOMBIE);
          monster.setCustomName("回血怪");
          monster.setCustomNameVisible(true);
      
          runLater(() => {
              if (monster.isValid()) {
                  // 怪物存活，为 Boss 回复生命值
                  entity.setHealth(entity.getHealth() + entity.getMaxHealth() * 0.1);
                  monster.remove(); // 移除怪物
              }
          }, 200); // 20秒延迟
        }
      }

      //概念秒杀技
      let Chance2 = 0.05
      if(chanceEvent(Chance2)){
        let playerworld =  player.getWorld();
        let playerlocation = player.getLocation();
        generateObsidianCage(player, playerworld, playerlocation, radius);
        // 20秒后移除笼子
        runLater(() => removeObsidianCage(player, playerworld, playerlocation, radius), 200);
      }
  
      
      
    }
  }
  
  cancelDamage(e);
  LightningStrike10(e);
}


// 取消火球伤害
function cancelDamage(event) {
  let entity = event.getEntity();
  let damager = event.getDamager();
  
  // 如果火球带有特定标签且击中了带有“三级怪物”标签的实体，则取消伤害
  if (hasTag(damager, "大火球") &&
      entity instanceof org.bukkit.entity.LivingEntity &&
      entity.getScoreboardTags().contains("三级怪物")) {
    event.setCancelled(true);
  }
}


function LightningStrike10(event) {
  let entity = event.getEntity();
  let damager = event.getDamager();
  
  // 如果闪电带有特定标签且伤害来源是玩家，则设置伤害为10
  if (hasTag(entity, "闪电10") && damager instanceof org.bukkit.entity.Player) {
    event.setDamage(10);
  }
  
  // 如果实体带有“三级怪物”标签，则取消事件
  if (hasTag(damager, "闪电10") &&
      entity instanceof org.bukkit.entity.LivingEntity &&
      entity.getScoreboardTags().contains("三级怪物")) {
    event.setCancelled(true);
  }
}


// 检查实体是否有特定标签
function hasTag(entity, customName) {
  return entity.getScoreboardTags().contains(customName);
};



// 生成黑曜石笼子
function generateObsidianCage(player, world, location, radius) {
  clearBlocks(world, location, radius, org.bukkit.Material.AIR, org.bukkit.Material.OBSIDIAN);
  player.sendMessage("生成了一个黑曜石笼子。");
}

// 移除黑曜石笼子并检查是否有玩家在里面
function removeObsidianCage(player, world, location, radius) {
  // 移除黑曜石笼子
  clearBlocks(world, location, radius, org.bukkit.Material.OBSIDIAN, org.bukkit.Material.AIR);

  // 检查并杀死笼子内的玩家
  const entities = world.getNearbyEntities(location, radius * 2, radius * 2, radius * 2);
  for (const entity of entities) {
    if (entity instanceof org.bukkit.entity.Player) {
      entity.setHealth(0);
      break; 
    }
  }

  player.sendMessage("黑曜石笼子已被移除。");
}

//设定特定类型方块
function clearBlocks(world, location, radius, fromMaterial, toMaterial) {
  for (let x = -radius; x <= radius; x++) {
    for (let y = -radius; y <= radius; y++) {
      for (let z = -radius; z <= radius; z++) {
        if (Math.abs(x) + Math.abs(y) + Math.abs(z) !== 0 && Math.sqrt(x * x + y * y + z * z) <= radius) {
          const blockLocation = location.clone().add(x, y, z);
          const block = world.getBlockAt(blockLocation);
          if (block.getType() === fromMaterial) {
            block.setType(toMaterial);
          }
        }
      }
    }
  }
}







