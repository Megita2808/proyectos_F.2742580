Feature: API of products
  As a developer
  I want to test the products API
  So that I can ensure it returns the expected products

  Scenario: Get all products
    Given I have the endpoint "https://api-aguamarina-mysql-v2.onrender.com/api/v2/products"
    When I send a GET request to the endpoint
    Then the response status should be 200
    And the response body should contain a list of products
    And the first product should have a "name" property
    Then the disponibility of all products should not be negative


  Scenario: Get product by ID
  Given I have the endpoint "https://api-aguamarina-mysql-v2.onrender.com/api/v2/products/1"
  When I send a GET request to the endpoint
  Then the response status should be 200
  And the response body should contain a list of products
  Then the disponibility of all products should not be negative
  Then the disponibility of all products should not be negative

