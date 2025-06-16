var EquipmentSlot = Java.type('org.bukkit.inventory.EquipmentSlot');
var Consumer = Java.type('java.util.function.Consumer');

function onUse(event) {
    var player = event.getPlayer();
    if (event.getHand() !== EquipmentSlot.HAND) {
        player.sendMessage("§c请用主手使用!");
        return;
    }
    
    var item = event.getItem();
    player.sendMessage("§a请在聊天中输入要添加的Lore内容(输入cancel取消):");

    var JSConsumer = Java.extend(Consumer, {
        accept: function(input) {
            if (input.toLowerCase() === "cancel") {
                player.sendMessage("§a已取消添加Lore。");
                return;
            }
            
            var meta = item.getItemMeta();
            var lore = meta.hasLore() ? meta.getLore() : new Java.type('java.util.ArrayList')();
            lore.add(input);
            meta.setLore(lore);
            item.setItemMeta(meta);
            
            player.sendMessage("§a已成功添加Lore: §r" + input);
        }
    });

    getChatInput(player, new JSConsumer());
}