'use strict'

export default function openDialog (additionSubject) {
  this.$store.commit('setAdditionSubject', additionSubject);
  this.$store.commit('setDialogState', true)
}
