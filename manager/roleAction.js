var Utils = require('../utils');

const init = (roleActions, bot) => {
  bot.on('custommessageReactionAdd', (messageReaction, user) => {
    if(roleActions[messageReaction.message.id]) {
      let role = null;
      if(roleActions[messageReaction.message.id][messageReaction.emoji.name]) {
        role = Utils.guild.roles.get(roleActions[messageReaction.message.id][messageReaction.emoji.name].role);
      } else if(messageReaction.emoji.id && roleActions[messageReaction.message.id][messageReaction.emoji.id]) {
        role = Utils.guild.roles.get(roleActions[messageReaction.message.id][messageReaction.emoji.id].role);
      } else {
        return;
      }
      if (!role) {
        return;
      }
      Utils.guild.fetchMember(user).then(member => {
        member.addRole(role);
        Utils.sendDM(user, `Le role **${role.name}** vous à été ajouté.`);
      }).catch(err => {
        Utils.log(err.stack, true);
      })
    }
  });

  bot.on('custommessageReactionRemove', (messageReaction, user) => {
    if(roleActions[messageReaction.message.id]) {
      let role = null;
      if(roleActions[messageReaction.message.id][messageReaction.emoji.name]) {
        role = Utils.guild.roles.get(roleActions[messageReaction.message.id][messageReaction.emoji.name].role);
      } else if(messageReaction.emoji.id && roleActions[messageReaction.message.id][messageReaction.emoji.id]) {
        role = Utils.guild.roles.get(roleActions[messageReaction.message.id][messageReaction.emoji.id].role);
      } else {
        return;
      }
      if (!role) {
        return;
      }
      Utils.guild.fetchMember(user).then(member => {
        member.removeRole(role);
        Utils.sendDM(user, `Le role **${role.name}** vous à été retiré.`);
      }).catch(err => {
        Utils.log(err.stack, true);
      })
    }
  }); 
}

module.exports = {
  init
}