const Course = require("../../models/main/course/course.model");

function checkUserAccessToCourse(request, response, next) {
  // Access the user object from the request object
  const user = request.user;
  // Check if the user is an admin
  if (user.role === "admin") {
    // If the user is an admin, continue to the next middleware function or controller
    next();
    return;
  }
  // Access the course title from the request parameters
  const courseTitle = request.params.title;
  console.log(user);

  // Check if the user has registered courses
  if (!Array.isArray(user.selectedCourse)) {
    // If the user has not registered any courses, return an error
    return res
      .status(401)
      .send({ error: "You are not authorized to access this course." });
  }
  // Check if the user has registered for the course
  const hasRegistered = user.selectedCourse.some(
    (course) => course === courseTitle
  );
  if (!hasRegistered) {
    // If the user has not registered, return an error
    return response
      .status(401)
      .send({ error: "You are not authorized to access this course." });
  }

  // If the user has registered, continue to the next middleware function or controller
  next();
}

async function checkUserAccessToCourseViaId(request, response, next) {
  try {
    // Access the user object from the request object
    const user = request.user;

    // Check if the user is an admin
    if (user.role === "admin") {
      // If the user is an admin, continue to the next middleware function or controller
      next();
      return;
    }

    const courseId = request.params.id;

    // Find the course with the given ID
    const course = await Course.findById(courseId);

    if (!course) {
      return response.status(404).send({ error: "Course not found." });
    }

    // Check if the user has registered courses
    if (!Array.isArray(user.selectedCourse)) {
      // If the user has not registered any courses, return an error
      return response
        .status(401)
        .send({ error: "You are not authorized to access this course." });
    }

    // Check if the user has registered for the course
    const hasRegistered = user.selectedCourse.some(
      (content) => content === course.title
    );

    if (!hasRegistered) {
      // If the user has not registered, return an error
      return response
        .status(401)
        .send({ error: "You are not authorized to access this course." });
    }

    // If the user has registered, continue to the next middleware function or controller
    next();
  } catch (error) {
    console.error(error);
    return response.status(500).send({ error: "Failed to retrieve course." });
  }
}

module.exports = {
  checkUserAccessToCourse,
  checkUserAccessToCourseViaId,
};
