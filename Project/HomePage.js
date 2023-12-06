import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Divider } from "react-native-elements";

import {
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
  addDoc,
  query,
  getDoc,
} from "firebase/firestore";
import { db } from "../Config";
import Tabs from "./Tabs";
import Drawers from "./Drawers";
import AntDesign from "react-native-vector-icons/AntDesign";
import { auth } from "../Config";
import Addsemester from "./Addsemester";

const HomePage = ({ navigation, route }) => {
  const { id } = route.params;
  console.log("The ID is : ", id);
  const [modalVisible, setModalVisible] = useState(false);

  const gradingScheme = {
    A: 4,
    "B+": 3.5,
    B: 3,
    "C+": 2.5,
    C: 2,
    D: 1,
    "D+": 1.5,
    F: 0,
  };

  useEffect(() => {
    read(id);
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigation.reset({
        routes: [{ name: "LoginScreen" }],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const calculatetermGPA = (courseList) => {
    let totalUnits = calculateUnits(courseList);
    let totalPoints = 0;

    for (courses of courseList) {
      console.log(courses.letterGrade);
      let points = courses.credit * gradingScheme[courses.letterGrade];
      totalPoints += points;
    }

    console.log(totalPoints);
    gpa = totalPoints / totalUnits;
    return Math.floor(gpa * 100) / 100;
  };

  const calculateUnits = (courseList) => {
    let totalUnits = 0;
    for (courses of courseList) {
      totalUnits += courses.credit;
    }
    return totalUnits;
  };

  const item = (doc) => {
    let semesters = doc.item.semesters;
    return (
      <View>
        {semesters.map((x) => (
          <TouchableOpacity onPress={() => afunction(x.semesterName)}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.headerText}>{x.semesterName}</Text>

                <TouchableOpacity></TouchableOpacity>
              </View>
              <View style={styles.body}>
                <View style={styles.section}>
                  <Text style={styles.titleText}>Term GPA</Text>
                  <Text style={styles.valueText}>
                    {calculatetermGPA(x.courses)}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.section}>
                  <Text style={styles.titleText}>Total Units</Text>
                  <Text style={styles.valueText}>
                    {calculateUnits(x.courses)}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const [name, setName] = useState();
  const [semester, setSemesters] = useState([]);

  const read = async (id) => {
    let temp = [];
    const docRef = doc(db, "students", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      temp.push(docSnap.data());

      setSemesters(temp);
      setName(docSnap.data()["name"]);
      console.log("The main thing", semester);
    } else {
      console.log("No such document!");
    }
  };

  const cumulativeGPA = () => {
    console.log("cumulative gpa ", semester);

    let totalGradePoints = 0;
    let totalCredits = 0;

    semester.forEach((pack) => {
      console.log("The pack", pack);
      pack.semesters.forEach((pack2) => {
        pack2.courses.forEach((pack3) => {
          const gradePoint = gradingScheme[pack3.letterGrade];
          const credit = pack3.credit;
          totalGradePoints += gradePoint * credit;
          totalCredits += credit;
        });
      });
    });
    console.log("Total grade points ", totalGradePoints);
    gpa = totalGradePoints / totalCredits;

    if (isNaN(gpa)) {
      return;
    }

    return Math.floor(gpa * 1000) / 1000;
  };

  const [courseDetails, setcourseDetails] = useState([]);

  const afunction = (term) => {
    for (i of semester[0]["semesters"]) {
      if (i.semesterName == term) {
        setcourseDetails(i.courses);
        console.log("Course Details : ", i.courses);
        setsemesterCode(term);
        setModalVisible(!modalVisible);
        return;
      }
    }
  };

  const [subjectGrade, setsubjectGrade] = useState();
  const [credit, setCredit] = useState();
  const [courseCode, setcourseCode] = useState();
  const [semesterCode, setsemesterCode] = useState();

  const updateDatabase = async () => {
    const docRef = doc(db, "students", id);
    await setDoc(docRef, semester[0])
      .then(() => {
        console.log("data submitted");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const deleteSemester = (id) => {
    let temp = semester;
    temp.forEach((student) => {
      student.semesters = student.semesters.filter(
        (semester) => semester.semesterName !== id
      );
    });
    console.log(JSON.stringify(semester, null, 2));
    setModalVisible(!modalVisible);
    alert("Semester Deleted");
    updateDatabase();
  };

  const deleteCourse = (id) => {
    let temp = semester;
    temp.forEach((student) => {
      student.semesters.forEach((semester) => {
        semester.courses = semester.courses.filter(
          (course) => course.courseCode !== id
        );
      });
    });
    setSemesters(temp);
    alert("Course Deleted");
    console.log(JSON.stringify(semester, null, 2));
    updateDatabase();
  };

  const editCourse = (id) => {
    let temp = semester;

    temp.forEach((student) => {
      student.semesters.forEach((semester) => {
        semester.courses.forEach((course) => {
          if (course.courseCode == id) {
            if (Number(subjectGrade) >= 90) {
              letterGrade = "A";
            } else if (
              Number(subjectGrade) >= 85 &&
              Number(subjectGrade) <= 89
            ) {
              letterGrade = "B+";
            } else if (
              Number(subjectGrade) >= 80 &&
              Number(subjectGrade) <= 84
            ) {
              letterGrade = "B";
            } else if (
              Number(subjectGrade) >= 75 &&
              Number(subjectGrade) <= 79
            ) {
              letterGrade = "C+";
            } else if (
              Number(subjectGrade) >= 70 &&
              Number(subjectGrade) <= 74
            ) {
              letterGrade = "C";
            } else if (
              Number(subjectGrade) >= 65 &&
              Number(subjectGrade) <= 69
            ) {
              letterGrade = "D+";
            } else if (
              Number(subjectGrade) >= 60 &&
              Number(subjectGrade) <= 64
            ) {
              letterGrade = "D";
            } else {
              letterGrade = "F";
            }

            if (subjectGrade === undefined) {
              const oldGrade = course.grade;
              course.grade = oldGrade;
              const oldLetterGrade = course.letterGrade;
              course.letterGrade = oldLetterGrade;
            } else {
              course.grade = subjectGrade;
              course.letterGrade = letterGrade;
            }
            if (credit === undefined) {
              const oldCredit = course.credit;
              course.credit = Number(oldCredit);
            } else {
              course.credit = Number(credit);
            }
          }
        });
      });
    });

    setSemesters(temp);
    console.log(JSON.stringify(semester, null, 2));
    console.log(semester);
    setsubjectGrade();
    setCredit();
    alert("Course Edited");
    updateDatabase();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigation.toggleDrawer()}
            >
              <MaterialCommunityIcons
                name="microsoft-xbox-controller-menu"
                size={34}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
          <View style={{ paddingBottom: 20 }}>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              {name}
            </Text>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              {id}
            </Text>
          </View>
          <View style={{ paddingTop: 8 }}>
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => handleSignOut()}
            >
              <AntDesign name="logout" size={23} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ paddingBottom: 20 }}>
          <Divider />
        </View>

        <View style={styles.circuleBorder}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            Cumulative GPA = {cumulativeGPA()}
          </Text>
        </View>
      </View>

      <View style={styles.form}>
        <TouchableOpacity
          style={{ paddingBottom: 15, paddingTop: 15 }}
          onPress={() => navigation.navigate("Addsemester", { id: result })}
        >
          <View style={[styles.circuleBorder, { borderColor: "black" }]}>
            <Text style={{ color: "black", fontWeight: "bold", fontSize: 16 }}>
              + Add Semester
            </Text>
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
          >
            <ScrollView>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Semester Details</Text>

                {courseDetails.map((x) => (
                  <View style={{ justifyContent: "space-evenly" }}>
                    {console.log("credit", x.credit)}
                    <Text>
                      {x.courseCode}, {x.courseName}
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                      <TextInput
                        style={styles.input}
                        placeholder="New Grade"
                        onChangeText={(text) => setsubjectGrade(text)}
                        keyboardType="numeric"
                        placeholderTextColor="black"
                      />
                      <TextInput
                        style={styles.input}
                        onChangeText={(text) => setCredit(text)}
                        keyboardType="numeric"
                        placeholder="New Credit"
                        placeholderTextColor="black"
                      />
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => editCourse(x.courseCode)}
                      >
                        <Text style={styles.buttonText}>Edit </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => deleteCourse(x.courseCode)}
                      >
                        <Text style={styles.buttonText}>Delete </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                  }}
                >
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => deleteSemester(semesterCode)}
                  >
                    <Text style={styles.buttonText}>Delete Semester</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, { textAlign: "center" }]}
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <Text style={[styles.buttonText, { paddingTop: 8 }]}>
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </Modal>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ paddingBottom: 15, paddingTop: 15 }}
          onPress={() => read(id)}
        >
          <View style={[styles.circuleBorder, { borderColor: "black" }]}>
            <Text style={{ color: "black", fontWeight: "bold", fontSize: 16 }}>
              Update Details
            </Text>
          </View>
        </TouchableOpacity>

        <FlatList data={semester} renderItem={item} />
      </View>
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  deleteButton: {
    borderRadius: 20,
    width: "60%",
    padding: 10,
    elevation: 2,
    backgroundColor: "#ccc",
    margin: 25,
  },
  closeButton: {
    borderRadius: 20,
    width: "60%",
    padding: 10,
    elevation: 2,
    backgroundColor: "#ff4d4d",
    margin: 25,
  },
  container: {
    flex: 1,
    backgroundColor: "#007bff",
  },
  circuleBorder: {
    padding: 10,
    borderColor: "white",
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#007bff",
    padding: 20,
    paddingVertical: 20,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  gpaContainer: {
    borderColor: "black",
    backgroundColor: "#fff",
    borderRadius: 20,
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 25,
  },
  gpaText: {
    color: "yellow",
    fontSize: 98,
    fontWeight: "bold",
  },
  idText: {
    fontSize: 16,
    color: "#fff",
  },
  cumulativeGpa: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 5,
  },

  semesterText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  gpaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  form: {
    flex: 1,
    padding: 15,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "white",
    justifyContent: "space-evenly",
    marginBottom: "-10%",
  },
  gpaText: {
    fontSize: 16,
    color: "#000",
  },
  gpaValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  unitsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  unitsText: {
    fontSize: 16,
    color: "#000",
  },
  unitsValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdownIcon: {
    position: "absolute",
    right: 10,
    top: 10,
  },

  card: {
    backgroundColor: "#E8EFF9",
    borderRadius: 10,
    padding: 15,
    margin: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  body: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "black",
  },
  section: {
    alignItems: "center",
    padding: 10,
    flex: 1,
  },
  titleText: {
    fontSize: 12,
    color: "black",
  },
  valueText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  divider: {
    height: "100%",
    width: 1,
    backgroundColor: "black",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 40,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 55,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    color: "#007bff",
  },
  input: {
    width: "50%",
    height: 40,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: 10,
    padding: 10,
    margin: 5,
  },
  button: {
    borderRadius: 20,
    width: "60%",
    padding: 3,
    elevation: 2,
    backgroundColor: "#007bff",
    margin: 35,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
