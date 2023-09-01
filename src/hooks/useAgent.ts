export function areMobile() {
  if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
    return true
  }
  return false
}
