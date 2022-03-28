// получение констант со страницы, регялярное выражение
const modalWindow = document.querySelector('.modal')
const formBtn = document.querySelector('.container-content__btn')
const cancelBtn = document.querySelector('.btn-cancel')
const closeBtn = document.querySelector('.modal-info__btn')
const container = document.querySelector('.main-container')
const body = document.querySelector('body')
const regExpValidPhone = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/
const nameInput = document.querySelector('.name')
const phoneInput = document.querySelector('.phone')
const submitBtn = document.querySelector('.btn-send')
const modalText = document.querySelector('.modal-info__text')
const preloader = document.querySelector('.preloader')

// функция валидации форм
const validateUser = (phoneNumber) => {
    try {
        if (phoneNumber.match(regExpValidPhone).length === 10) {  // проверка введенного телефона на соответствие решулярному выражению
            return (phoneNumber.match(regExpValidPhone).length === 10)
        }
    } catch (error) {
        preloader.classList.remove('visible');
        preloader.classList.add('hidden');
        modalWindow.style.marginTop = '10%'
        modalText.innerHTML = 'Кажется, вы ввели неправильный телефон! Пожалуйста, проверьте его еще раз!'
        throw error  // создание ошибки, чтобы не произошел запрос
    }
}

// функция создания запроса
const createQuery = (url) => {
    return fetch(url).
    then(response => response.json()).
    then(data => {
        localStorage.setItem('response', JSON.stringify(data))  // сохранение всех данных из запроса в localStorage
        return JSON.parse(localStorage.getItem('response')) 
    }).
    catch(() => {
        modalText.innerHTML = 'Что-то пошло не так! Проверьте соединение и попробуйте еще раз'
        preloader.classList.remove('visible');
        preloader.classList.add('hidden');
    })
} 
 
// функция фильтрации запроса
const handleQuery = () => {
    const url = 'https://jsonplaceholder.typicode.com/todos'

    createQuery(url).then(data => {
        const res = data.filter(item => {  // фильтруем данные
            if (item.userId === 5 && !item.completed) {
                modalWindow.style.marginTop = '5%'
                preloader.classList.remove('visible');
                preloader.classList.add('hidden');
                return item
            }
        })
        const filteredList = res.map((item, i) => {  // шаблон вывода данных
            return `<div class="response-item-container">
                        <div class="response-item"><span>user id:</span> ${res[i].userId}</div>
                        <div class="response-item"><span>id: </span>${res[i].id}</div>
                        <div class="response-item"><span>title: </span>${res[i].title}</div>
                        <div class="response-item"><span>completed: </span>${res[i].completed}</div>
                    </div>
            `
        }).join('')
        modalText.innerHTML = `<div class="response-container">
                                   ${filteredList}
                               </div>`  // выводим данные в модальное окно 
    })
}

// скрытие и открытие модального окна 
formBtn.addEventListener('click', () => {
    modalWindow.style.display = 'block'
    container.style.opacity = '.3'
    body.style.overflow = 'hidden'
})
cancelBtn.addEventListener('click', () => {
    modalWindow.style.display = 'none'
    container.style.opacity = '1'
    body.style.overflow = 'scroll'
})
closeBtn.addEventListener('click', () => {
    modalWindow.style.display = 'none'
    container.style.opacity = '1'
    body.style.overflow = 'scroll'
})
// нажатие на кнопку "отправить" или submit любой из форм
submitBtn.addEventListener('click', () => {
    const phoneValue = phoneInput.value
    const nameValue = nameInput.value 
    if (phoneValue && nameValue.length >= 3) {
        preloader.classList.remove('hidden');  // создаем индикатор загрузки при отправке запроса 
        preloader.classList.add('visible');
        if (nameValue.length >= 3) {  // валидация имени пользователя
            validateUser(phoneValue)
            handleQuery()
        } else {
            modalWindow.style.marginTop = '10%'
            modalText.innerHTML = 'Введите правильные данные! Проверьте введенное имя еще раз!'
        }
    } else {
        modalText.innerHTML = 'Ваши формы выглядят пустыми! Заполните их!'
    }
    
})
nameInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        const phoneValue = phoneInput.value
        const nameValue = nameInput.value 
        if (nameValue.length >= 3) {
            validateUser(phoneValue)
            handleQuery()
        } else {
            modalWindow.style.marginTop = '10%'
            modalText.innerHTML = 'Введите правильные данные! Проверьте введенное имя еще раз!'
        }
    }
})
phoneInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        const phoneValue = phoneInput.value
        const nameValue = nameInput.value 
        if (nameValue.length >= 3) {
            validateUser(phoneValue)
            handleQuery()
        } else {
            modalWindow.style.marginTop = '10%'
            modalText.innerHTML = 'Введите правильные данные! Проверьте введенное имя еще раз!'
        }
    }
})