/// <reference types="Cypress" />

const USERNAME = Cypress.env('username')
const PASSWORD = Cypress.env('password')

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
        let values = []
        let accountId;

        cy.openNewAccount(ACCOUNT_TYPE).then(($el) => {
            accountId = $el.find('a').text()
        })        
        cy.get('#newAccountId').click()
        cy.wait(3000)
        cy.contains('Account Details').next().find('tr').each(($el) => {
            cy.wrap($el).invoke('text').then(text => {
                values.push(text.replace(/\s+(?=\s)/g, '').trim())
            })
        }).then(() => {
            expect(values).to.deep.eq([`Account Number: ${accountId}`, `Account Type: ${ACCOUNT_TYPE}`, 'Balance: $100.00', 'Available: $100.00'])
        })
    })

    it('Verification of Bill Pay section', () => {
        let fromAccount = Cypress.env('baseAccount')
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

    afterEach(() => {
        cy.logout()
    })
})