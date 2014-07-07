@dev @formatting
Feature: Formatting book content
  I expect to not have any formatting issues when reading a book.

  @CR-331
  Scenario: Issue with negative text indents in book 9781446417508
    Given I open book with the ISBN of 9781446417508
    Then I expect the text "French Onion Soup" to not be clipped

  @CR-334
  Scenario: Header and footer should not be styled.
    Given I open a book
    And I change the font family to "Times new Roman"
    Then I expect the header to have font family "sans-serif"
    And I expect the footer to have font family "sans-serif"

