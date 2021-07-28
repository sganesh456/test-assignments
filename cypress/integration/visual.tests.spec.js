/// <reference types="Cypress" />


const USERNAME = Cypress.env('username')
const PASSWORD = Cypress.env('password')
const fromAccount = Cypress.env('baseAccount')

context('Verify Account Creation page visuals', () => {

    beforeEach(() => {
        cy.visit('/index.htm')
        cy.login(USERNAME, PASSWORD)
    })

    it('Verification of new account overview page visuals', () => {               
        cy.openNewAccount('CHECKING')
        cy.get('#newAccountId').click()
        cy.percySnapshot('New Account Page overview')   
    })

    it('Verification of base account overview page visuals', () => {
        cy.contains('Accounts Overview').click()
        cy.contains(Cypress.env('baseAccount')).click()
        cy.percySnapshot('Base Account Page overview')
    })

    it('Verification of base account overivew page visuals after a billpay', () => {
        const PAYEENAME = 'test'
        let fromAccount = Cypress.env('baseAccount')

        cy.doBillPay(fromAccount, Cypress.env('newAccountId'), PAYEENAME, '200.00')        
        cy.contains('Bill Payment Complete')

        cy.contains('Accounts Overview').click()        
        cy.contains(Cypress.env('baseAccount')).click()        
        cy.percySnapshot('Base Account Page overview after billpay')

        cy.contains('Accounts Overview').click()        
        cy.contains(Cypress.env('newAccountId')).click()        
        cy.percySnapshot('New Account Page overview after billpay')
    })
})