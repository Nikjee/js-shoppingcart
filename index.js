let fruits = [
    {id: 1, title: 'Яблоки', price: 20,count:1,img:'https://m.dom-eda.com/uploads/images/catalog/item/86df51de21/c25c94fe96_1000.jpg'},
    {id: 2, title: 'Апельсины', price: 30,count:1,img:'https://foodcity.ru/storage/products/October2018/6XZSr6ddCl6cxfo0UchP.jpg'},
    {id: 3, title: 'Манго', price: 40,count:1,img:'https://st3.depositphotos.com/1020804/12760/i/600/depositphotos_127608560-stock-photo-mango-cubes-and-mango-fruit.jpg'},
]
const toHtml = fruits => `
<div class="col">
    <div class="card">
        <img src="${fruits.img}" class="card-img-top" style='height:400px' alt="${fruits.title}">
        <div class="card-body">
            <h5 class="card-title">${fruits.title}</h5>
            <a href="#" class="btn btn-secondary" data-btn="price" data-id="${fruits.id}">Посмотреть цену</a>
            <a href="#" class="btn btn-danger" data-btn="remove" data-id="${fruits.id}">Удалить</a>
            <a href="#" class="btn btn-primary" data-btn="addToCart" data-id="${fruits.id}">Добавить в корзниу</a>
        </div>
    </div>
</div>
`
function render() {
    const html = fruits.map(fruit => toHtml(fruit)).join('')
    document.querySelector('#fruits').innerHTML = html
}

render()

const cartHtml = cart => `
    <div class="cart__item">
        <div class="cart__fruit">
            <div class="cart__fruit-title"><strong>Товар</strong></div>
            <div class="cart__fruit-name">${cart.title}</div>
        </div>
        <div class="cart__price">
            <div class="cart__price-title"><strong>Цена</strong></div>
            <div class="cart__price-cost">${cart.price}</div>
        </div>
        <div class="cart__quantity">
            <button class="cart__quantity-minus" data-id="${cart.id}" data-btn="removeItemFromCart">-</button>
            <input  class="cart__quantity-count" type="number" data-id="${cart.id}" value="${cart.count}">
            <button class="cart__quantity-plus" data-id="${cart.id}" data-btn="addItemToCart">+</button>
        </div>
        <div class="cart__delete-item btn btn-danger" data-id="${cart.id}" data-btn="removeFromCartAll">X</div>
        <div class="cart__total">
            <div class="cart__total-title"><strong>Сумма</strong></div>
            <div class="cart__total-price" data-id="${cart.id}">${cart.total}</div>
        </div>
    </div>
        
`
function renderCart() {
    const html = cart.map(cart => cartHtml(cart)).join('')
    return html
}
function updateCart(){
    const html = cart.map(cart => cartHtml(cart)).join('')
    document.querySelector('#cart').innerHTML = html
    updateTotal()
}
function updateTotal(){
    const total = countTotal()
    document.querySelector('#total').innerHTML = total
}

const priceModal = $.modal({
    title: 'Цена на товар',
    closable: true,
    width: '400px',
    footerButtons: [
        {text: 'Закрыть', type:'primary', handler(){
           priceModal.close()
        }},
    ]
})

let cart = []

document.addEventListener('click',event =>{
    event.preventDefault()
    const btnType = event.target.dataset.btn
    const id = +event.target.dataset.id
    const fruit = fruits.find(f => f.id === id)
    const cartItem = cart.find(c => c.id === id)
    if(btnType === 'price'){  
        priceModal.setContent(`
        <p>Цена на ${fruit.title}: <strong>${fruit.price}</strong>p</p>`)
        priceModal.open()
    }else if(btnType === 'remove'){
        $.confirm({
            title:'Вы уверены?',
            content:`<p>Вы удаляете фрукт:<strong>${fruit.title}</strong></p>`
        }).then( () => {
            fruits = fruits.filter(f => f.id !== id)
            render()
        }).catch( () => {
            console.log('Cancel');
        })
    }else if(btnType === 'addToCart'){
       _addItemToCart(fruit)
        countItems() 
    }else if(btnType === 'Cart'){
        $.cart({
            title:'Корзина',
            content:`<div id="cart">
            ${renderCart()}
            </div>`,
            Test:`<div class="cart__total-footer">
            <div class="cart__total-footer-sum"><strong>Итого:</strong><span id="total">${countTotal()}</span></div>
            </div>`
        }).then(() => cartTotalClear()).catch(() => console.log('Close'))
        const input = document.querySelector('#cart')
        input.addEventListener('change',updateValue)
        

    }else if(btnType === 'CartClear'){
        cartTotalClear()
    }else if(btnType === 'removeFromCartAll'){
        cart = cart.filter(c => c.id !== id)
        updateCart()
        countItems()
    }else if(btnType === 'removeItemFromCart'){
        minusItem(cartItem)
        countItems()
    }else if(btnType === 'addItemToCart'){
        plusItem(cartItem)
        countItems()
    }
})

function cartTotalClear(){
    cart = []
    countItems()
}

function updateValue(e){
    let id = +e.target.dataset.id
    let value = +e.target.value
    
    for(let i in cart){
        if(cart[i].id === id){
            cart[i].count = value
            cartTotalUpdate(i)
        }
    }
    
    updateCart()
}

function countItems(){
    let count = 0
    for(let i in cart){
        count += cart[i].count
    }
    document.querySelector('.cartCount').textContent = count 
}

function countTotal(){
    let total = 0
    for(let i in cart){
        total += cart[i].total
    }
    return total
}

function _copyItemToCart(item){
    let itemCopy = {}
    for(let i in item){
        itemCopy[i] = item[i]
    }
    itemCopy.total = itemCopy.price * itemCopy.count
    return itemCopy
}

function _addItemToCart(item){
    for(let i in cart){
        if(cart[i].id === item.id){
            cart[i].count++
            cart[i].total = cart[i].price * cart[i].count
            return
        }
    }
    cart.push(_copyItemToCart(item))
}

function minusItem(item){
    for(let i in cart) {
        if(cart[i].id === item.id) {
          if(cart[i].count === 0) {
            return
          }
          cart[i].count--
          cartTotalUpdate(i)
        }
    }
    
    updateCart()
}

function plusItem(item){
    for(let i in cart) {
        if(cart[i].id === item.id) {
          cart[i].count++
          cartTotalUpdate(i)
        }
    }
    
    updateCart()
}

function cartTotalUpdate(i){
    cart[i].total = cart[i].price * cart[i].count
}