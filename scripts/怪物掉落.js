let ItemStack = org.bukkit.inventory.ItemStack;
let Material = org.bukkit.Material;
//安全获取物品
function getItemSafe(item) {
  if (item === null) {
    return new ItemStack(Material.AIR);
  }
  //复制类型数量Meta
  let safeItem = new ItemStack(item.getType());
  safeItem.setAmount(item.getAmount());
  if (item.hasItemMeta()) {
    safeItem.setItemMeta(item.getItemMeta());
  }
  return safeItem;
}
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
    const itemStack = getItemSafe(slimefunItem.getItem());
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
  const itemStack = getItemSafe(slimefunItem.getItem());
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
  const itemStack = getItemSafe(slimefunItem.getItem());
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

  let multiplier = 0.7;
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
    if (damager instanceof org.bukkit.entity.Player) {
      let player = damager;
      let entityworld = entity.getWorld();
      let entitylocation = entity.getLocation();
      let playerworld =  player.getWorld();
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
      let Chance2 = 0.001
      if(chanceEvent(Chance2)){
        let playerlocation = player.getLocation();
        generateObsidianCage(player, playerworld, playerlocation, radius);
        // 20秒后移除笼子
        runLater(() => removeObsidianCage(player, playerworld, playerlocation, radius), 200);
      }

      //雷公助我
      let Chance3 = 0.05
      if(chanceEvent(Chance3)){
        //let playerlocation = player.getLocation();
        let teleportLocation = entitylocation.add(0, 10, 0);
        entity.teleport(teleportLocation);
        entity.setGravity(false);
        runLater(() => {
          entity.teleport(entitylocation);
          entity.setGravity(true);
        }, 100);
        runLater(() => {
          player.sendTitle("§c§l雷公助我!!!!!!","", 0, 70, 20);
          let lightningCount = 10;
          for (let i = 0; i < lightningCount; i++) {
            let randomX = entitylocation.getBlockX() + Math.floor(Math.random() * 31) - 15;
            let randomZ = entitylocation.getBlockZ() + Math.floor(Math.random() * 31) - 15;
            let randomY = playerworld.getHighestBlockYAt(randomX, randomZ);
            let lightningLocation = new org.bukkit.Location(playerworld, randomX, randomY, randomZ);
            let strikeLightning = playerworld.strikeLightning(lightningLocation);
            strikeLightning.addScoreboardTag("闪电100");
          }
        }, 50);       
      }

      //回血信标
      let Chance4 = 0.05;
      if(chanceEvent(Chance4) && entity.getMaxHealth()* 0.1 >= entity.getHealth()){
        EntityadditionalHealth(entitylocation, entityworld);
      }

      // //禁锢
      // let Chance4 = 0.05;
      // if(chanceEvent(Chance4)) {
      //   let playerlocation = player.getLocation();
      //   const currentTime = new Date().getTime();
      //   lastUseTime = currentTime;
      //   runRepeating((t) => {
      //    const currentTime = new Date().getTime();
      //    player.teleport(playerlocation);
      //    if (currentTime - lastUseTime > 15000) {
      //       t.cancel();
      //     }
      //   }, 10, 1);
      // }

      //召唤技能(10僵尸100血30攻击)
      let Chance5 = 0.05;
      if(chanceEvent(Chance5)){
        let zombieCount = 10;

        player.sendTitle("§c§l复活吧!额滴爱人!","", 0, 70, 20);

        runLater(() => {
          for (let i = 0; i < zombieCount; i++) {
            let x = entitylocation.getX() + (Math.random() * 10 - 5);
            let y = entitylocation.getY() + (Math.random() * 5);
            let z = entitylocation.getZ() + (Math.random() * 10 - 5);
        
            let location = new org.bukkit.Location(entityworld, x, y, z);
            if (entityworld.getBlockAt(location).getType() == org.bukkit.Material.AIR) {
              let zombie = entityworld.spawnEntity(location, org.bukkit.entity.EntityType.ZOMBIE);
                  zombie.getAttribute(org.bukkit.attribute.Attribute.GENERIC_MAX_HEALTH).setBaseValue(100.0);
                  zombie.setHealth(100.0);
  
                  zombie.getAttribute(org.bukkit.attribute.Attribute.GENERIC_ATTACK_DAMAGE).setBaseValue(30.0);
                  zombie.setTarget(player);
            }
          }
        }, 50);
      }

      let Chance6 = 0.05;
      if(chanceEvent(Chance6)){
        player.sendTitle("§c§l来吧,尝下这招 火球术","", 0, 70, 20);
        let playerlocation = player.getLocation();
        runLater(() => {
          let lightningCount = 20;
          for (let i = 0; i < lightningCount; i++) {
            let randomX = entitylocation.getBlockX() + Math.floor(Math.random() * 31) - 15;
            let randomZ = entitylocation.getBlockZ() + Math.floor(Math.random() * 31) - 15;
            let randomY = entitylocation.getBlockY() + 10;
            let lightningLocation = new org.bukkit.Location(playerworld, randomX, randomY, randomZ);
            let fireball = playerworld.spawn(lightningLocation, org.bukkit.entity.SmallFireball, org.bukkit.event.entity.CreatureSpawnEvent.SpawnReason.CUSTOM);
            let direction =playerlocation.toVector().subtract(lightningLocation.toVector()).normalize();
            fireball.setDirection(direction);
          }
        }, 50); 
      }
    }
  }


  if (entity instanceof org.bukkit.entity.Player){
    let player = entity;
    let helmet = player.getInventory().getHelmet();
    let sfItem = getSfItemByItem(helmet);
    if(sfItem !== null && sfItem.getId() === "JP_头盔"){
      let damage = e.getFinalDamage();
      let a = e.get
      let charge = sfItem.getItemCharge(helmet);
      if(charge < damage){
        return;
      } else{
        sfItem.removeItemCharge(helmet, damage);
        player.sendMessage(sfItem.getItemCharge(helmet));
        e.setCancelled(true);
      }
    }
  }

  
  tagdamagebyentitytag(e, "大火球", 0, "三级怪物");
  tagdamagebyentitytag(e, "闪电10", 10, "三级怪物");
  tagdamagebyentitytag(e, "闪电100", 100, "四级怪物");
  entitytagbymultbychance(e, "四级怪物", 2, 0.2);//暴击20%概率造成伤害x2倍
  entitytagbychance(e, "四级怪物", 0.2);//闪避20%概率
  entitytagbychancebymult(e, "四级怪物", 0.2, 0.2);//吸血20%概率+伤害x0.2倍数回血
  entitytagbychancebystoptime(e, "四级怪物", 0.2, 5000);//眩晕20概率+15秒眩晕
}


function EntityadditionalHealth(location, world) {
  let material = org.bukkit.Material;
  let soulLanternlocation = location.clone().add(0, 3, 0);

  let positions = [
    location.clone().add(0, 4, 0), // 上
    location.clone().add(0, 2, 0), // 下
    location.clone().add(1, 3, 0), // 右
    location.clone().add(-1, 3, 0), // 左
    location.clone().add(0, 3, 1), // 前
    location.clone().add(0, 3, -1)  // 后
  ];

  let soulLantern = material.SOUL_LANTERN;
  let reinforcedDeepSlate = material.REINFORCED_DEEPSLATE;

  // 设置中心方块
  if (world.getBlockAt(soulLanternlocation).getType() === material.AIR) {
    world.getBlockAt(soulLanternlocation).setType(soulLantern);
  }

  positions.forEach((pos) => {
    if (world.getBlockAt(pos).getType() === material.AIR) {
      world.getBlockAt(pos).setType(reinforcedDeepSlate);
    }
  });

  runLater(() => {
    if (world.getBlockAt(soulLanternlocation).getType() === soulLantern) {
      world.getBlockAt(soulLanternlocation).setType(material.AIR);
    }
  }, 3000);

  runRepeating((t) => {
    let entities = world.getNearbyEntities(soulLanternlocation, 10, 5, 10);
    for (let entity of entities) {
      if (entity instanceof org.bukkit.entity.Monster) {
        if (entity.isValid()){
          let additionalHealth = entity.getHealth() + (entity.getMaxHealth() * 0.02);
          entity.setHealth(Math.min(additionalHealth, entity.getMaxHealth()));
        }
      }
    }


    let centerBlockType = world.getBlockAt(soulLanternlocation).getType();
    if (centerBlockType !== soulLantern) {
      t.cancel();
      positions.forEach((pos) => {
        if (world.getBlockAt(pos).getType() === reinforcedDeepSlate) {
          world.getBlockAt(pos).setType(material.AIR);
        }
      });
    }
  }, 100, 100);
}

//标签伤害实体标签
function tagdamagebyentitytag(e, tag, damage, entitytag){
  let entity = e.getEntity();
  let damager = e.getDamager();
  
  if (hasTag(entity, tag) && damager instanceof org.bukkit.entity.Player){
    e.setDamage(damage);
  }
  
  if (hasTag(damager, tag) &&
      entity instanceof org.bukkit.entity.LivingEntity &&
      entity.getScoreboardTags().contains(entitytag)){
      e.setCancelled(true);
  }
}

//暴击
function entitytagbymultbychance(e, entitytag, mult, Chance){
  let entity = e.getDamager();
  if (hasTag(entity, entitytag)){
    if(chanceEvent(Chance)){
      let newDamage = e.getDamage() * mult;
      e.setDamage(newDamage);
    }
  }
}

//闪避
function entitytagbychance(e, entitytag, Chance){
  let entity = e.getEntity();
  if (hasTag(entity, entitytag)){
    if(chanceEvent(Chance)){
      e.setCancelled(true);
    }
  }
}

//免疫某种装备
function entitytagbyitemid(e, entitytag){
  let entity = e.getEntity();
  let player = e.getDamager();
  if (hasTag(entity, entitytag) && player instanceof org.bukkit.entity.Player){
    let boots = player.getInventory().getBoots();
    let sfItem = getSfItemByItem(boots);
    if (sfItem !== null && sfItem.getId() === "ARMOUR_BOOTS"){
      let lore = sfItem.getLore();
      if(lore.some((line) => line.includes("无尽奇点"))){
        e.setCancelled(true);
        player.sendMessage("该生物从你身上的匠魂套汲取到了你的生命,并且无视了你的伤害");
        entity.setHealth(entity.getMaxHealth());
        runLater(() => player.setHealth(0), 10);
      }
    }
  }
}

//吸血

function entitytagbychancebymult(e, entitytag, Chance, mult){
  let entity = e.getDamager();
  if (hasTag(entity, entitytag)){
    if(chanceEvent(Chance)){
      let newHealth = entity.getHealth() + (e.getFinalDamage() * mult);
      entity.setHealth(newHealth);
    }
  }
}

//眩晕
function entitytagbychancebystoptime(e, entitytag, chance, stoptime){
  let player = e.getEntity();
  let entity = e.getDamager();
  if(hasTag(entity, entitytag)){
    if(player instanceof org.bukkit.entity.Player){
      if(chanceEvent(chance)) {
        let playerlocation = player.getLocation();
        const currentTime = new Date().getTime();
        lastUseTime = currentTime;
        runRepeating((t) => {
         const currentTime = new Date().getTime();
         player.teleport(playerlocation);
         if (currentTime - lastUseTime > stoptime){
            t.cancel();
          }
        }, 10, 1);
      }
    }
  }
}



// 检查实体是否有特定标签
function hasTag(entity, customName){
  return entity.getScoreboardTags().contains(customName);
};



// 生成黑曜石笼子
function generateObsidianCage(player, world, location, radius){
  clearBlocks(world, location, radius, org.bukkit.Material.AIR, org.bukkit.Material.OBSIDIAN);
  player.sendMessage("你需要在20s内逃出笼子,否则就会被秒杀");
}

// 移除黑曜石笼子并检查是否有玩家在里面
function removeObsidianCage(player, world, location, radius){
  // 移除黑曜石笼子
  clearBlocks(world, location, radius, org.bukkit.Material.OBSIDIAN, org.bukkit.Material.AIR);

  // 检查并杀死笼子内的玩家
  const entities = world.getNearbyEntities(location, radius, radius, radius);
  for (const entity of entities) {
    if (entity instanceof org.bukkit.entity.Player) {
      entity.setHealth(0);
      break; 
    }
  }
}

//设定特定类型方块
function clearBlocks(world, location, radius, fromMaterial, toMaterial){
  for (let x = -radius; x <= radius; x++){
    for (let y = -radius; y <= radius; y++){
      for (let z = -radius; z <= radius; z++){
        if (Math.abs(x) + Math.abs(y) + Math.abs(z) !== 0 && Math.sqrt(x * x + y * y + z * z) <= radius){
          const blockLocation = location.clone().add(x, y, z);
          const block = world.getBlockAt(blockLocation);
          if (block.getType() === fromMaterial){
            block.setType(toMaterial);
          }
        }
      }
    }
  }
}








