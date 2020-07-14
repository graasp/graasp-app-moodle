// The user MUST be enrolled as teacher in at least 1 course
const MOODLE_API_ENDPOINT = Cypress.env('MOODLE_URL')
  ? Cypress.env('MOODLE_URL')
  : // : 'http://localhost:8082';
    'http://localhost/moodle';
const MOODLE_USERNAME = 'teacher';
const MOODLE_PASSWORD = 'teacher';

const GRAASP_URL = Cypress.env('APP_URL')
  ? Cypress.env('APP_URL')
  : // : 'http://localhost:8000';
    'http://localhost:3000';
const APP_INSTANCE_ID = '6156e70ab253020033364411';
const GRAASP_TEACHER_APP_URL = `${GRAASP_URL}/?spaceId=5b56e70ab253020033364411&appInstanceId=${APP_INSTANCE_ID}&mode=teacher&userId=5b56e70ab253020033364416&dev=true`;

const saveUnfilteredButtonId = '#saveRawAsAppInstanceResourceButton';
const saveFilteredButtonId = '#saveFilteredAsAppInstanceResourceButton';
const apiEndpointTextFieldId = '#apiEndpoint';
const usernameTextFieldId = '#username';
const passwordTextFieldId = '#password';
const establishConnectionButtonId = '#establishConnection';
const importCourseButtonId = '#importCourse';
const courseSelectionInputId = '#courseSelection';
const targetFilterInputId = '#filter-target';
const deleteAppInstanceButtonClass = '.deleteAppInstanceButton';

describe('Import data from Moodle', () => {
  it('Opens the Graasp App', () => {
    cy.visit(GRAASP_TEACHER_APP_URL);
  });

  it('Checks that no data is loaded yet and buttons disabled', () => {
    cy.contains('Sorry, no matching records found');
    cy.get(saveUnfilteredButtonId).should('be.disabled');
    cy.get(saveFilteredButtonId).should('be.disabled');
  });

  describe('Import a course', () => {
    it('Opens Settings', () => {
      cy.get('button[aria-label="Settings"]').click();
      cy.contains('Settings');
    });

    it('Checks that establish connection button is disabled when fields are empty', () => {
      cy.get(apiEndpointTextFieldId).clear();
      cy.get(usernameTextFieldId).clear();
      cy.get(passwordTextFieldId).clear();
      cy.get(establishConnectionButtonId).contains('Establish Connection');
      cy.get(establishConnectionButtonId).should('be.disabled');
    });

    it('Establishs the connection', () => {
      cy.get(apiEndpointTextFieldId).type(MOODLE_API_ENDPOINT);
      cy.get(usernameTextFieldId).type(MOODLE_USERNAME);
      cy.get(passwordTextFieldId).type(MOODLE_PASSWORD);
      cy.get(establishConnectionButtonId).should('not.be.disabled');
      cy.get(establishConnectionButtonId).click();
      cy.get(establishConnectionButtonId).contains('Connection Established');
    });

    // TODO: must wait here until the courses are loaded
    it('Imports data of a course', () => {
      cy.contains('Select Course(s) to Import');
      cy.get(importCourseButtonId).should('be.disabled');

      // Select the first available course and import it
      cy.get(courseSelectionInputId).click();
      cy.focused().type('{downArrow}{enter}', { force: true });
      cy.get(importCourseButtonId).should('not.be.disabled');
      cy.get(importCourseButtonId).click();
      cy.contains('created'); // specific action type used at least once when "creating" a moodle course
    });
  });

  describe('Saves the Imported Data as App Instance Resource', () => {
    /* 
      first, delete any possible ressources. This is action is performed just at
      this stage, because resources are loadad async. And if placed at the very 
      beginning of the test, they aren't present yet.
    */
    it('Deletes any previous saved resources', () => {
      if (
        document.getElementsByClassName('deleteAppInstanceButton').length > 0
      ) {
        cy.get(deleteAppInstanceButtonClass).click({ multiple: true });
      }
    });

    it('Checks that buttons are enabled/disabled depending on filter state', () => {
      cy.get(saveUnfilteredButtonId).should('not.be.disabled');
      cy.get(saveFilteredButtonId).should('be.disabled');
      // set a filter
      cy.get(targetFilterInputId).click();
      cy.get(targetFilterInputId).type('course');
      cy.focused().type('{downArrow}{enter}', { force: true });
      // recheck buttons
      cy.get(saveUnfilteredButtonId).should('not.be.disabled');
      cy.get(saveFilteredButtonId).should('not.be.disabled');
    });

    it('Saves the current data', () => {
      cy.get(saveUnfilteredButtonId).click();
      cy.get('table')
        .find('td')
        .contains(APP_INSTANCE_ID)
        .next()
        .contains(MOODLE_API_ENDPOINT);
    });

    it('Deletes the saved resources', () => {
      cy.get(deleteAppInstanceButtonClass).click({ multiple: true });
    });
  });
});
