export default function(obj) {
    for (let key in obj) { // trim all string props in this.client
    if (typeof(obj[key]) === 'string') obj[key] = obj[key].trim()
  }
}