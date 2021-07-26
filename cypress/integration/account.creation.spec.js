/// <reference types="Cypress" />

const USERNAME = Cypress.env('username')
const PASSWORD = Cypress.env('password')
const fromAccount = Cypress.env('baseAccount')

context('Verify Account Creation', () => {

    beforeEach(() => {
        cy.visit('/index.htm')
        cy.login(USERNAME, PASSWORD)
    })

    it('Verification of opening a checking account', () => {               
        cy.openNewAccount('CHECKING')
        cy.get('#newAccountId').click()            
    })

    it('Verification of opening a savings account', () => {               
        cy.openNewAccount('SAVINGS')
        cy.get('#newAccountId').click()            
    })

    it('Verification of account details page', () => {
        const ACCOUNT_TYPE = 'SAVINGS'
        let accountId;

        cy.openNewAccount(ACCOUNT_TYPE)
        cy.get('#newAccountId').then(($el) => {
            accountId = $el.text()
            cy.wrap($el).click()
            cy.verifyAccountDetails(accountId, ACCOUNT_TYPE, '$100.00', '$100.00')
        })
    })

    it('Verification of Bill Pay section', () => {
        let amount = '200.00'
        let payeeName = 'test'

        cy.doBillPay(fromAccount, Cypress.env('newAccountId'), payeeName, amount)
        cy.wait(3000)
        cy.contains('Bill Payment Complete').then(($el) => {
            cy.wrap($el).next()
        }).then(($text) => {           
            expect($text.text().trim()).equal(`Bill Payment to ${payeeName} in the amount of $${amount} from account ${fromAccount} was successful.`)
        })
    })

    it('Verification of Account Overview section', () => {
        const payeeName = 'test'
        let fromAccount = Cypress.env('baseAccount')
        let initialBalance
        let availableAmount

        cy.openNewAccount('SAVINGS')

        cy.contains('Accounts Overview').click()
        cy.contains('td', fromAccount).siblings().then(($el) => {
            initialBalance = $el[0].innerText
            availableAmount = $el[1].innerText
        })

        cy.doBillPay(fromAccount, Cypress.env('newAccountId'), payeeName, '200.00')
        cy.contains('Bill Payment Complete')

        cy.contains('Accounts Overview').click()
        cy.contains('td', fromAccount).siblings().then(($el) => {
              cy.convertToInt($el[0].innerText).then(finalBalance => {
                  cy.convertToInt(initialBalance).then(value => {
                      expect(finalBalance).to.be.eq(value - 200.00)
              })
            })
        })

        cy.contains('td > a', fromAccount).click()
        cy.get('#transactionTable').find('td').then(($el) => {
            $el.text().includes(`Bill Payment to ${payeeName}`)
        })
    })

    afterEach(() => {
        cy.logout()
    })
})