// Elements
const app = document.getElementById("app")

const nav = document.createElement("nav")
const searchInput = document.createElement("input")
searchInput.placeholder = "Search"
nav.appendChild(searchInput)
app.appendChild(nav)

const userSection = document.createElement("section")
app.appendChild(userSection)

// Data
let allUsers = null

// Util
const sleep = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms))

const getUsers = async () => {
    await sleep(3000)
    const response = await fetch("https://api.github.com/users")
    const data = await response.json()
    allUsers = data
    return data
}

const createLoading = () => {
    const article = document.createElement("span")
    article.innerText = "Loading..."
    return article
}

const createMessage = () => {
    const article = document.createElement("span")
    article.innerText = "Nothing found"
    return article
}

const createArticle = (user) => {
    const article = document.createElement("article")

    const img = document.createElement("img")
    img.src = user.avatar_url
    article.appendChild(img)

    const p = document.createElement("p")
    p.innerText = user.login
    article.appendChild(p)

    const button = document.createElement("button")
    button.innerText = "Show more"
    article.appendChild(button)

    const div = document.createElement("div")
    const rankP = document.createElement("p")
    rankP.innerText = "Rank: " + user.type
    const adminP = document.createElement("p")
    adminP.innerText = "Admin: " + user.site_admin
    div.appendChild(rankP)
    div.appendChild(adminP)

    let isShown = false
    button.addEventListener("click", () => {
        if (!isShown) {
            button.innerText = "Show less"
            article.appendChild(div)
            isShown = true
        } else {
            button.innerText = "Show more"
            article.removeChild(div)
            isShown = false
        }
    })

    return article
}

const render = (users) => {
    userSection.innerHTML = ""
    for (const user of users) {
        const article = createArticle(user)
        userSection.appendChild(article)
    }
}

const init = async () => {
    const loading = createLoading()
    userSection.appendChild(loading)
    const users = await getUsers()
    userSection.removeChild(loading)
    render(users)
}

// Event listeners
searchInput.addEventListener("input", (event) => {
    const search = event.target.value
    if (!allUsers) return

    const filteredUsers = allUsers.filter(user => user.login.startsWith(search))
    if (filteredUsers.length) {
        render(filteredUsers)
    } else {
        userSection.innerHTML = ""
        const message = createMessage()
        userSection.appendChild(message)
    }
})

window.addEventListener("load", () => {
    init()
})