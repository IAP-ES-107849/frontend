Feature: Landing Page

  Scenario: Landing Page Contains Login Button that redirects to login_sign_up page
    Given a new user,
    When they visit the landing page
    And select “Get Started“ button,
    Then the user should be redirected to the login_sign_up page.
