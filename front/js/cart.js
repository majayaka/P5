const cart = []

retrieveCart()
cart.forEach((item) => displayItem(item))

function retrieveCart() {
    const numberOfItems = localStorage.length
    for(let i = 0; i < numberOfItems; i++) {
        const item = localStorage.getItem(localStorage.key(i)) || ""
        const itemObject = JSON.parse(item)
        cart.push(itemObject)
    }
}

function displayItem(item) {
    const article = makeArticle(item)
    const imageDiv = makeImageDiv(item) 
    article.appendChild(imageDiv)
    
    const cartItemContent = makeCartContent(item)
    article.appendChild(cartItemContent)
    displayArticle(article)
    displayTotalQuantity()
    displayTotalPrice()
}

function displayTotalQuantity() {
    const totalQuantity = document.querySelector("#totalQuantity")
    const total = cart.reduce((total, item) => total + item.quantity, 0)
    totalQuantity.textContent = total
}

function displayTotalPrice() {
    const totalPrice = document.querySelector("#totalPrice")
    const total = cart.reduce((total, item) => total + item.price * item.quantity, 0)
    totalPrice.textContent = total
}




function makeArticle(item) {
    const article = document.createElement("article")
    article.classList.add("cart__item")
    article.dataset.id = item.id
    article.dataset.color = item.color
    return article
}

function makeImageDiv(item) {
    const div = document.createElement("div")
    div.classList.add("cart__item__img")

    const image = document.createElement("img")
    image.src = item.imageUrl
    image.alt = item.altTxt
    div.appendChild(image)
    return div
}

function makeCartContent(item) {
    const cartItemContent = document.createElement("div")
 cartItemContent.classList.add("cart__item__content")
    
    const description = makeDescription(item)
    const settings = makeSettings(item)

 cartItemContent.appendChild(description)
 cartItemContent.appendChild(settings)
    return cartItemContent
}

function makeSettings(item) {
    const settings = document.createElement("div")
    settings.classList.add("cart__item__content__settings")

    addQuantityToSettings(settings, item)
    addDeleteButton(settings)
    return settings
}

function addDeleteButton(settings) {
    const div = document.createElement("div")
    div.classList.add("cart__item__content__settings__delete")
    const p = document.createElement("p")
    p.textContent = "Supprimer"
    div.appendChild(p)
    settings.appendChild(div)
}

   

function addQuantityToSettings(settings, item) {
    const quantity = document.createElement("div")
    quantity.classList.add("cart__item__content__settings__quantity")
    const p = document.createElement("p")
    p.textContent = "Qté : "
    const input = document.createElement("input")
    input.type = "number"
    input.classList.add("itemQuantity")
    input.name = "itemQuantity"
    input.value = item.quantity
    input.min = "1"
    input.max = "100"
    input.addEventListener("input", () => updatePriceAndQuantity(item.id, input.value, item))

    quantity.appendChild(p)
    settings.appendChild(quantity)
    quantity.appendChild(input)
}

function updatePriceAndQuantity (id, newValue, item) {
    const itemToUpdate = cart.find(item => item.id === id)
    itemToUpdate.quantity = Number(newValue) 
    displayTotalQuantity()
    displayTotalPrice()
    saveNewDataToCache(item)
}

function saveNewDataToCache(item) {
    const dataToSave = JSON.stringify(item)
    localStorage.setItem(item.id, dataToSave)
}


function makeDescription(item) {
    const description = document.createElement("div")
    description.classList.add("cart__item__content__description")

    const h2 = document.createElement("h2")
    h2.textContent = item.name

    const p = document.createElement("p")
    p.textContent = item.color

    const p2 = document.createElement("p")
    p2.textContent = item.price + " €"

    description.appendChild(h2)
    description.appendChild(p)
    description.appendChild(p2)
    return description
    
}

function displayArticle(article) {
    document.querySelector("#cart__items").appendChild(article)
}



