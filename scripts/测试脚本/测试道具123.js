function onUse(event) {
  let player = event.getPlayer();
  let sfblock = event.getSlimefunBlock();
  
  if (sfblock === null) {
    player.sendMessage("所指非粘液方块");
    return;
  }

  // 获取点击的方块（Optional<Block>）
  let clickedBlockOpt = event.getClickedBlock();
  
  // 检查方块是否存在
  if (!clickedBlockOpt.isPresent()) {
    player.sendMessage("未检测到方块");
    return;
  }

  // 获取方块对象
  let clickedBlock = clickedBlockOpt.get();
  
  // 获取方块的位置
  let loc = clickedBlock.getLocation();
  
  // 获取粘液科技机器并查询能量
  let machine = StorageCacheUtils.getSfItem(loc);
  let charge = machine.getCharge(loc);
  machine.removeCharge(loc, 100000);
  //machine.addCharge(loc, 1000);
  
  player.sendMessage("当前能量: " + charge);
}