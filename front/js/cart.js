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
    addDeleteButton(settings, item)
    return settings
}

function addDeleteButton(settings,item) {
    const div = document.createElement("div")
    div.classList.add("cart__item__content__settings__delete")
    div.addEventListener("click", () => deleteItem(item))

    const p = document.createElement("p")
    p.textContent = "Supprimer"
    div.appendChild(p)
    settings.appendChild(div)
}

function deleteItem(item) {
    const itemToDelete = cart.findIndex(
        (product) => product.id === item.id && product.color === item.color)
    cart.splice(itemToDelete,1)
    displayTotalPrice()
    displayTotalQuantity()
    deleteDataFromCache(item)
    deleteArticleFromPage(item)
}

function deleteArticleFromPage(item) {
    const articleToDelete = document.querySelector(
        `article[data-id="${item.id}"][data-color="${item.color}"]`
        ) 
    articleToDelete.remove()
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
    input.addEventListener("input", () => updatePriceAndQuantity(input.value, item))

    quantity.appendChild(p)
    settings.appendChild(quantity)
    quantity.appendChild(input)
}

function updatePriceAndQuantity (newValue, item) {
    const itemToUpdate = cart.find(cartItem => cartItem.id === item.id)
    itemToUpdate.quantity = Number(newValue) 
    item.quantity = itemToUpdate.quantity
    displayTotalQuantity()
    displayTotalPrice()
    saveNewDataToCache(item)
}

function deleteDataFromCache(item) {
    const key = `${item.id}-${item.color}`
    localStorage.removeItem(key)
}

function saveNewDataToCache(item) {
    const dataToSave = JSON.stringify(item)
    const key = `${item.id}- ${item.color}`
    localStorage.setItem(key, dataToSave)
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

    const orderButton = document.querySelector("#order")
    orderButton.addEventListener("click", (e) => submitForm(e))


function submitForm(e) {
    e.preventDefault()
    if (cart.length === 0)  {
        alert("Your cart is empty!")
        return
    }

    if (isFormInvalid()) return
    if (isEmailInvalid()) return

    const requestData = makeRequestData()
    fetch("http://localhost:3000/api/products/order", {
        method : "POST",
        body : JSON.stringify(requestData),
        headers : {
            "Content-Type" : "application/json"
        }   
    })
    .then(response => response.json())
    .then((data) => {
        const orderId = data.orderId
        window.location.href = "confirmation.html?orderId=" + data.orderId
    })
    .catch((err) => console.error(err))
}

function isEmailInvalid() {
    const email = document.querySelector("#email").value
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address")
        return true
    }
    return false
}



function isFormInvalid() {
    const form = document.querySelector(".cart__order__form")
    const inputs = form.querySelectorAll("input")
    inputs.forEach((input) => {
        if (input.value === "") {
            alert("Please fill in all fields")
            return true
        }
        return false    
    }) 
}


function makeRequestData() {
    const form = document.querySelector(".cart__order__form")
    const contact = {
        firstName : form.elements.firstName.value,
        lastName : form.elements.lastName.value,
        address : form.elements.address.value,
        city : form.elements.city.value,
        email : form.elements.email.value
    }
    const products = cart.map(item => item.id)
    const requestData = {
        contact,
        products
    }
return requestData

}

function getIdsfromCache() {
    const numberOfProducts = localStorage.length
    const ids = []
    for (let i = 0; i < numberOfProducts; i++) {
        const key = localStorage.key(i)
        const id = key.split("-")[0]    
        ids.push(item.id)
    }
    return ids
}