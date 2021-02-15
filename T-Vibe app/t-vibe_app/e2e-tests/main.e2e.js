const puppeteer = require('puppeteer');

jest.setTimeout(200000)

let browser, page

const link = "http://localhost:3000/"
const browserSettings = {
    headless: false,
    slowMo: 200,
    args: [`--window-size=700,800`, `--window-position=0,0`]
}

function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time)
    })
}

describe("Register user and edit user profile", () => {
    beforeAll(async () => {
        // create two browsers
        browser = await puppeteer.launch(browserSettings)
        page = await browser.newPage()
        await page.goto(link)
    })

    afterAll(async () => {
        await browser.close()
    })

    test(`go to register page`, async () => {
        await page.click(`a[name=registerLink]`)
        await page.waitForSelector(`h4[name=register]`)
        const registerText = await page.$('h4[name=register') 
        expect(await registerText.evaluate(node => node.innerText)).toBe('Register')
    })

    test(`create account on register page`, async () => {
        await page.click(`input[name="firstname"]`)
        await page.type(`input[name="firstname"]`, `Peter`)
        await page.click(`input[name="lastname"]`)
        await page.type(`input[name="lastname"]`, `Pannekoek`)
        await page.click(`input[name="username"]`)
        await page.type(`input[name="username"]`, `Ppannekoeketer`)
        await page.click(`input[name=email]`)
        await page.type(`input[name=email]`, `peter@pannekoek.nl`)
        await page.click(`input[name=password]`)
        await page.type(`input[name=password]`, `pannekoek`)
        await page.click(`input[name=confirmPassword]`)
        await page.type(`input[name=confirmPassword]`, `pannekoek`)

        const registerButton = await page.$(`button[name=registerButton]`)
        expect(registerButton).toBeDefined()
        await registerButton.click()

        await page.waitForSelector(`h4[name=welcome]`)
        const welcomeText = await page.$('h4[name=welcome]')
        expect(await welcomeText.evaluate(node => node.innerText)).toBe('Welcome to T-Vibe!')
     })

     test(`go to my profile`, async () => {
        const myProfileNav = await page.$(`a[name=myProfile]`)
        expect(myProfileNav).toBeDefined()
        await myProfileNav.click()
    
        await page.waitForSelector(`h2[name=yourProfile]`)
        const yourProfileText = await page.$('h2[name=yourProfile]')
        expect(await yourProfileText.evaluate(node => node.innerText)).toBe('Your profile')
    })

    test(`go to edit profile`, async () => {
        const editProfileButton = await page.$(`button[name=editProfileButton]`)
        expect(editProfileButton).toBeDefined()
        await editProfileButton.click()
    
        await page.waitForSelector(`h2[name=editProfile]`)
        const yourProfileText = await page.$('h2[name=editProfile]')
        expect(await yourProfileText.evaluate(node => node.innerText)).toBe('Edit profile')
    })

    test(`edit profile`, async () => {
        await page.click(`input[name="firstname"]`)
        for (let i = 0; i < "Peter".length; i++) { await page.keyboard.press('Backspace') }
        await page.type(`input[name="firstname"]`, `Pannekoek`)
        await page.click(`input[name="surname"]`)
        for (let i = 0; i < "Pannekoek".length; i++) { await page.keyboard.press('Backspace') }
        await page.type(`input[name="surname"]`, `Peter`)

        const saveChangesButton = await page.$(`button[name=saveChangesButton]`)
        expect(saveChangesButton).toBeDefined()
        await saveChangesButton.click()
    
        await page.waitForSelector(`h2[name=yourProfile]`)
        const yourProfileText = await page.$('h2[name=yourProfile]')
        expect(await yourProfileText.evaluate(node => node.innerText)).toBe('Your profile')
    })
})

//The following tests require an account with username 'Ppannekoeketer' and password 'pannekoek' in order to pass. 

describe("Follow another user", () => {
    beforeAll(async () => {
        // create two browsers
        browser = await puppeteer.launch(browserSettings)
        page = await browser.newPage()
        await page.goto(link)

        await page.click(`input[name="username"]`)
        await page.type(`input[name="username"]`, `Ppannekoeketer`)
        await page.click(`input[name=password]`)
        await page.type(`input[name=password]`, `pannekoek`)

        const loginButton = await page.$(`button[name=loginButton]`)
        await loginButton.click()
    })

    afterAll(async () => {
        await browser.close()
    })

    test(`go to search page`, async () => {
        const searchNav = await page.$(`a[name=search]`)
        expect(searchNav).toBeDefined()
        await searchNav.click()

        const searchHeaderText = await page.$('h4[name=searchHeader')
        expect(await searchHeaderText.evaluate(node => node.innerText)).toBe('Search')
    })

    test(`follow a user`, async () => {
        const searchBar = await page.$(`input[name="Search"]`)
        expect(searchBar).toBeDefined()
        await searchBar.click()
        await page.type(`input[name="Search"]`, `Diego`)
        await page.keyboard.press('Enter')

        await page.waitFor(`button[name="profileButton"]`)
        const profileButton = await page.$(`button[name="profileButton"]`)
        await profileButton.click()

        await page.waitFor(`button[name="followButton"]`)
        const followButton = await page.$(`button[name="followButton"]`)
        await followButton.click()

        await delay(4000)
    })

})

describe("Unfollow another user", () => {
    beforeAll(async () => {
        // create two browsers
        browser = await puppeteer.launch(browserSettings)
        page = await browser.newPage()
        await page.goto(link)

        await page.click(`input[name="username"]`)
        await page.type(`input[name="username"]`, `Ppannekoeketer`)
        await page.click(`input[name=password]`)
        await page.type(`input[name=password]`, `pannekoek`)

        const loginButton = await page.$(`button[name=loginButton]`)
        await loginButton.click()
    })

    afterAll(async () => {
        await browser.close()
    })

    test(`go to search page`, async () => {
        const searchNav = await page.$(`a[name=search]`)
        expect(searchNav).toBeDefined()
        await searchNav.click()

        const searchHeaderText = await page.$('h4[name=searchHeader')
        expect(await searchHeaderText.evaluate(node => node.innerText)).toBe('Search')
    })

    test(`unfollow a user`, async () => {
        const searchBar = await page.$(`input[name="Search"]`)
        expect(searchBar).toBeDefined()
        await searchBar.click()
        await page.type(`input[name="Search"]`, `Diego`)
        await page.keyboard.press('Enter')

        await page.waitFor(`button[name="profileButton"]`)
        const profileButton = await page.$(`button[name="profileButton"]`)
        expect(profileButton).toBeDefined()
        await profileButton.click()

        await page.waitFor(`button[name="playlistButton"]`)
        const playlistButton = await page.$(`button[name="playlistButton"]`)
        expect(playlistButton).toBeDefined()
        await playlistButton.click()

        await delay(4000)

        await page.waitFor(`button[name="unfollowButton"]`)
        const followButton = await page.$(`button[name="unfollowButton"]`)
        expect(followButton).toBeDefined()
        await followButton.click()

        await delay(4000)
    })

})

describe("Create playlist", () => {
    beforeAll(async () => {
        // create two browsers
        browser = await puppeteer.launch(browserSettings)
        page = await browser.newPage()
        await page.goto(link)
    })

    afterAll(async () => {
        await browser.close()
    })


    test(`login page loads in browser A`, async () => {
        await page.waitForSelector(`h4[name=login]`)
        const loginHeader = await page.$('h4[name=login]')
        expect(await loginHeader.evaluate(node => node.innerText)).toBe('Login')
    })


    test(`can login at A`, async () => {
        await page.click(`input[name="username"]`)
        await page.type(`input[name="username"]`, `Ppannekoeketer`)
        await page.click(`input[name=password]`)
        await page.type(`input[name=password]`, `pannekoek`)

        const loginButton = await page.$(`button[name=loginButton]`)
        expect(loginButton).toBeDefined()
        await loginButton.click()

        await page.waitForSelector(`h4[name=welcome]`)
        const welcomeText = await page.$('h4[name=welcome]')
        expect(await welcomeText.evaluate(node => node.innerText)).toBe('Welcome to T-Vibe!')
    })

    test(`go to playlist page`, async () => {
        await page.click(`a[name=playlists]`)
        await page.waitForSelector(`h4[name=playlistOverview]`)
        const playlistOverviewText = await page.$('h4[name=playlistOverview')
        expect(await playlistOverviewText.evaluate(node => node.innerText)).toBe('Playlist overview')
    })

    test(`go to create playlist`, async () => {
        const createPlaylistButton = await page.$(`button[name=createPlaylist]`)
        expect(createPlaylistButton).toBeDefined()
        await createPlaylistButton.click()

        await page.waitForSelector(`h4[name=playlist]`)
        const createPlaylistText = await page.$('h4[name=playlist')
        expect(await createPlaylistText.evaluate(node => node.innerText)).toBe('New Playlist')
    })

    test(`add track to playlist`, async () => {
        await page.waitForSelector(`h4[name=playlist]`)
        const createPlaylistText = await page.$('h4[name=playlist')
        expect(await createPlaylistText.evaluate(node => node.innerText)).toBe('New Playlist')
    })

    test(`create a playlist with one track`, async () => {
        await page.click(`input[name="TrackUrl"]`)
        await page.type(`input[name="TrackUrl"]`, `https://open.spotify.com/track/6wNMSuu92piCZFRj7cYWCY?si=FKrnZHm0QUaTIZ2SLdYmbA`)

        const addTrackButton = await page.$(`button[name=addTrack]`)
        expect(addTrackButton).toBeDefined()
        await addTrackButton.click()

        await page.click(`input[name="playlistName"]`)
        await page.type(`input[name="playlistName"]`, `TestPlaylist`)

        const saveChangesButton = await page.$(`button#saveChanges`)
        expect(saveChangesButton).toBeDefined()
        await saveChangesButton.click()

        await page.waitForSelector(`h2[name=playlistTitle]`)
        const playlistTitle = await page.$('h2[name=playlistTitle]')
        expect(await playlistTitle.evaluate(node => node.innerText)).toBe('TestPlaylist')
    })

    test(`go to edit playlist`, async () => {
        const editPlaylistButton = await page.$(`button#editPlaylist`)
        expect(editPlaylistButton).toBeDefined()
        await editPlaylistButton.click()
    
        const playlistHeader = await page.waitForSelector(`h4[name=playlist]`)
        expect(playlistHeader).toBeDefined()
    
        const createPlaylistText = await page.$('h4[name=playlist')
        expect(await createPlaylistText.evaluate(node => node.innerText)).toBe('TestPlaylist')
    })
    
})

describe("Search for playlists", () => {
    beforeAll(async () => {
        // create two browsers
        browser = await puppeteer.launch(browserSettings)
        page = await browser.newPage()
        await page.goto(link)

        await page.click(`input[name="username"]`)
        await page.type(`input[name="username"]`, `Ppannekoeketer`)
        await page.click(`input[name=password]`)
        await page.type(`input[name=password]`, `pannekoek`)

        const loginButton = await page.$(`button[name=loginButton]`)
        await loginButton.click()
    })

    afterAll(async () => {
        await browser.close()
    })

    test(`go to search page`, async () => {
        const searchNav = await page.$(`a[name=search]`)
        expect(searchNav).toBeDefined()
        await searchNav.click()

        const searchHeaderText = await page.$('h4[name=searchHeader')
        expect(await searchHeaderText.evaluate(node => node.innerText)).toBe('Search')
    })

    test(`search for a playlist`, async () => {
        const searchBar = await page.$(`input[name="Search"]`)
        expect(searchBar).toBeDefined()
        await searchBar.click()
        await page.type(`input[name="Search"]`, `test`)
        await page.keyboard.press('Enter')
    })

})



describe("Play radio", () => {
    beforeAll(async () => {
        // create two browsers
        browser = await puppeteer.launch(browserSettings)
        page = await browser.newPage()
        await page.goto(link)

        await page.click(`input[name="username"]`)
        await page.type(`input[name="username"]`, `Ppannekoeketer`)
        await page.click(`input[name=password]`)
        await page.type(`input[name=password]`, `pannekoek`)

        const loginButton = await page.$(`button[name=loginButton]`)
        await loginButton.click()
    })

    afterAll(async () => {
        await browser.close()
    })

    test(`play on genre`, async () => {
        const genreSelector = await page.$(`input[name=radio-genre-selector]`)
        await genreSelector.click()
        const genreOption = await page.$(`li[name=carnaval]`)
        await genreOption.click()

        const playButton = await page.$(`svg[name=playButton`)
        await playButton.click()

        await delay(4000)

        const player = await page.$(`iframe[title=RadioIframe]`)
        expect(player).toBeDefined()
    })
})

describe("Unfollow user", () => {
    beforeAll(async () => {
        browser = await puppeteer.launch(browserSettings)
        page = await browser.newPage()
        await page.goto(link)

        await page.click(`input[name="username"]`)
        await page.type(`input[name="username"]`, `Ppannekoeketer`)
        await page.click(`input[name=password]`)
        await page.type(`input[name=password]`, `pannekoek`)

        const loginButton = await page.$(`button[name=loginButton]`)
        await loginButton.click()
    })


    afterAll(async () => {
        await browser.close()
    })



})

describe("Change password", () => {
    beforeAll(async () => {
        browser = await puppeteer.launch(browserSettings)
        page = await browser.newPage()
        await page.goto(link)

        await page.click(`input[name="username"]`)
        await page.type(`input[name="username"]`, `Ppannekoeketer`)
        await page.click(`input[name=password]`)
        await page.type(`input[name=password]`, `pannekoek`)

        const loginButton = await page.$(`button[name=loginButton]`)
        await loginButton.click()
    })


    afterAll(async () => {
        await browser.close()
    })

    test(`go to my profile`, async () => {
        const myProfileNav = await page.$(`a[name=myProfile]`)
        expect(myProfileNav).toBeDefined()
        await myProfileNav.click()

        await page.waitForSelector(`h2[name=yourProfile]`)
        const yourProfileText = await page.$('h2[name=yourProfile]')
        expect(await yourProfileText.evaluate(node => node.innerText)).toBe('Your profile')
    })


    test(`go to edit password`, async () => {
        const editPasswordButton = await page.$(`button[name=editPasswordButton]`)
        expect(editPasswordButton).toBeDefined()
        await editPasswordButton.click()

        await page.waitForSelector(`h2[name=editPassword]`)
        const yourPasswordText = await page.$('h2[name=editPassword]')
        expect(await yourPasswordText.evaluate(node => node.innerText)).toBe('Edit password')
    })

    test(`edit password`, async () => {
        await page.click(`input[name="oldPassword"]`)
        await page.type(`input[name="oldPassword"]`, `pannekoek`)
        await page.click(`input[name="newPassword"]`)
        await page.type(`input[name="newPassword"]`, `Koekenpan`)
        await page.click(`input[name="confirmPassword"]`)
        await page.type(`input[name="confirmPassword"]`, `Koekenpan`)

        const saveChangesButton = await page.$(`button[name=saveChangesButton]`)
        expect(saveChangesButton).toBeDefined()
        await saveChangesButton.click()

        await page.waitForSelector(`h2[name=yourProfile]`)
        const yourProfileText = await page.$('h2[name=yourProfile]')
        expect(await yourProfileText.evaluate(node => node.innerText)).toBe('Your profile')
    })
})
