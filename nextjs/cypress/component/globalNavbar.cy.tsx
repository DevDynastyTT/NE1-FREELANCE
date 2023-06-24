import GlobalNavbar from "@components/GlobalNavbar";
import { SessionType } from "@utils/types";
const session:SessionType = {
          "_id": "647edc693d65f9c41481db97",
          "username": "Aaron",
          "email": "aaronhazzard2018@gmail.com",
          "password": "$2b$10$fVh0.QYpaTEY8uzO1Oyy8eP4b0mgIlZH0g7nZQIks2UVOAeGrkxj2",
          "isStaff": false,
          "isActive": true,
          "dateJoined": "2023-06-06T07:12:41.421Z"
        }
describe("Test login component", () => {
  beforeEach(() => {
    cy.mount(<GlobalNavbar session={session}/>);
  });
  it("It should load", ()=>{  })
})