/**
  Endpoints related to classrooms
**/

const router = require("express").Router();

const {
  getAllClassrooms,
  getClassroomsById,
  getClassroomsByLibId,
  addNewClassroom,
  modifyClassroom,
} = require("./classroomsHandlers");

router.get("/classrooms", getAllClassrooms); // gets all classrooms

router.get("/classrooms/:_id", getClassroomsById); //get classroom by Id
router.get("/classrooms/bylib/:_libId", getClassroomsByLibId); //get classroom by Library Id
router.post("/classrooms", addNewClassroom); //add a classroom to classrooms collection (BODY: _id(uuid4), teacherEmail, name, library_id, classList (empty array to start)
router.put("/classrooms/:_id", modifyClassroom); //modifies classroom (typically for class list) (BODY: teacher_id, name, library_id, classList )

module.exports = router;
