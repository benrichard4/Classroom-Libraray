/**
  Endpoints related to users
**/

const router = require("express").Router();
const {
  getTeachers,
  getTeacherByEmail,
  postNewTeacher,
  deleteTeacher,
} = require("./teachersHandlers");

//.......................................//
//TEACHER ROUTES                         //
//.......................................//
router.get("/teachers", getTeachers); //get all teachers
router.get("/teachers/:email", getTeacherByEmail); //get teacher by email, using Auth0 email
router.post("/teachers", postNewTeacher); //when new teacher creates an account, create the object in teacher collection (BODY: id(uuid4), username(from Autho0), givenName,surname, libraries(empty array to start), classroooms(empty array to start), categories(from categories collection))

router.delete("/teachers/:email", deleteTeacher); //when a teacher deletes their account

//NOT SURE IF NEEDED (UPDATED FROM LIBRARIES AND CLASSROOM ROUTES)...............................................//
//router.patch("/teachers/:username/library", addNewLibrary); //for when a teachER creates                          //
//a new library BODY(library:[{library_id#1, library_name#1}, {library_id#2, library_name#2} etc...])               //
//router.patch("teachers/:username/classroom", addNewClassroom); // for when a teacher creates                      //
//a new classroom BODY(classrooms:[{classroom_id#1, classroom_name#1}, {classroomy_id#2, classroom_name#2} etc...]) //
//..................................................................................................................//

module.exports = router;
