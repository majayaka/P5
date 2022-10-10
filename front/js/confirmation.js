const orderId = getOrderId()
displayOrderId(orderId)
deleteAllCache()

function getOrderId() {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    return urlParams.get("orderId")
}

function displayOrderId() {
    const orderIdElement = document.querySelector("#orderId")
    orderIdElement.textContent = orderId
}

function deleteAllCache() {
    const cache = window.localStorage
    cache.clear()
}
