/// <reference types="Cypress" />

const USERNAME = Cypress.env('username');
const PASSWORD = Cypress.env('password')

context('Verify Account Creation', () => {
    beforeEach(() => {
        cy.visit('/index.htm')
    })

    it('Verification of opening a savings account', () => {
        cy.login(USERNAME, PASSWORD)
    })

    afterEach(() => {
        cy.logout()
    })
})