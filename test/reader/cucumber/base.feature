@dev
Feature: Example scenarios
  As a user of the cross platform reader library
  I want to write tests for it
  using the gherkin language

  @dev
  Scenario: Open a book
    Given I open book with the ISBN of 9781844037162
    Then the isbn should equal "9781844037162"