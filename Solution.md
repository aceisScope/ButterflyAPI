# Brief Solution Intro

## Endpoints

- `POST` /ratings :  Add a rating. Allow a user to rate butterflies on a scale of 0 through 5.

  | PARAMETERS   |      REQUIRED      |  DESCRIPTION |
  |----------|:-------------:|------:|
  | userId |  true | the id of the user, string |
  | butterflyId |    true   |  the id of the butterfly to rate, string |
  | rating | true |    user rating, number, a scale of 0 through  |


- `GET` /ratings : Allow retrieval of a list of a user's rated butterflies, sorted by rating

  | PARAMETERS   |      REQUIRED      |  DESCRIPTION |
  |----------|:-------------:|------:|
  | userId |  true | the id of the user, string |

### Trade-offs: 

- Initially, I was considering designing the endpoint as `/users/ratings/:id`. However thinking from extensiblity point of view, `ratings` is potentially a resource that may be queried with other parameters, for example `/ratings?butterflyId=some-id`. So eventually I decided to define `/ratings` endpoint.
- Currently the rating adding endpoint requires the user and the butterfly already exist in the database. It may be more flexisble to make the parameters optional in a real-life scenario, for example is a butterfly is not recorded but still to be rated, the user can be asked to add the record of the butterfly.

