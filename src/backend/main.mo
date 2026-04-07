import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Int "mo:core/Int";

actor {
  ////////////////////////////////////////////////////////////
  // Types
  ////////////////////////////////////////////////////////////

  type RepType = {
    #normal;
    #amrap;
    #timed;
  };

  type Exercise = {
    id : Text;
    name : Text;
    sets : Nat;
    reps : Text;
    notes : ?Text;
    repType : RepType;
  };

  type MovementPattern = {
    id : Text;
    name : Text;
    exercises : [Exercise];
  };

  type WorkoutDay = {
    id : Nat;
    name : Text;
    patterns : [MovementPattern];
  };

  type SelectedExercise = {
    patternId : Text;
    exerciseId : Text;
  };

  type WorkoutLog = {
    id : Text;
    dayId : Nat;
    completedAt : Time.Time;
    selectedExercises : [SelectedExercise];
  };

  module WorkoutLog {
    public func compare(log1 : WorkoutLog, log2 : WorkoutLog) : Order.Order {
      Int.compare(log2.completedAt, log1.completedAt);
    };
  };

  ////////////////////////////////////////////////////////////
  // Persistent Storage
  ////////////////////////////////////////////////////////////

  let workoutLogs = Map.empty<Text, WorkoutLog>();
  var logIdCounter = 0;

  ////////////////////////////////////////////////////////////
  // Hardcoded Program Data
  ////////////////////////////////////////////////////////////

  func createExercise(id : Text, name : Text, sets : Nat, reps : Text, notes : ?Text, repType : RepType) : Exercise {
    {
      id;
      name;
      sets;
      reps;
      notes;
      repType;
    };
  };

  func createMovementPattern(id : Text, name : Text, exercises : [Exercise]) : MovementPattern {
    {
      id;
      name;
      exercises;
    };
  };

  func buildWorkoutDays() : [WorkoutDay] {
    [
      buildDay1(),
      buildDay2(),
      buildDay3(),
      buildDay4(),
    ];
  };

  func buildDay1() : WorkoutDay {
    {
      id = 1;
      name = "Day 1";
      patterns = [
        createMovementPattern(
          "hinge",
          "Hinge",
          [
            createExercise("dumbbell-rdl", "Dumbbell RDL", 3, "12", null, #normal),
            createExercise("barbell-rdl", "Barbell RDL", 3, "10", null, #normal),
            createExercise("snatch-grip-rdl", "Snatch Grip RDL", 3, "10", null, #normal),
          ],
        ),
        createMovementPattern(
          "vertical-press",
          "Vertical Press",
          [
            createExercise("half-kneeling-db-ohp", "1/2 Kneeling DB Single Arm Overhead Press", 3, "12ea", null, #normal),
            createExercise("half-kneeling-landmine", "1/2 Kneeling Landmine Press", 3, "10ea", null, #normal),
            createExercise("tall-kneeling-landmine", "Tall Kneeling Enhanced Eccentric Landmine Press", 3, "6ea", ?"Down phase 4-5 seconds", #normal),
          ],
        ),
        createMovementPattern(
          "horizontal-pull",
          "Horizontal Pull",
          [
            createExercise("db-incline-row", "DB Incline Chest Supported Row", 3, "15", ?"Bench no higher than 45 degrees", #normal),
            createExercise("db-seal-row", "DB Seal Row", 3, "12", null, #normal),
            createExercise("pendlay-row", "Pendlay Row", 3, "10", ?"Bar should rest on ground between reps", #normal),
          ],
        ),
        createMovementPattern(
          "lunge",
          "Lunge",
          [
            createExercise("db-split-squat", "Dumbbell Split Squat", 3, "10ea", null, #normal),
            createExercise("db-walking-lunge", "Dumbbell Walking Lunge", 3, "8ea", null, #normal),
            createExercise("db-deficit-reverse-lunge", "Dumbbell Deficit Reverse Lunge", 3, "6ea", ?"Keep weight through lead leg", #normal),
          ],
        ),
        createMovementPattern(
          "anterior-chain",
          "Anterior Chain",
          [
            createExercise("hanging-hollow-body", "Hanging Hollow Body", 3, "30sec", ?"Pull hips to ribs", #timed),
            createExercise("hanging-knee-tuck", "Hanging Knee Tuck", 3, "AMRAP", ?"Pull hips to ribs", #amrap),
            createExercise("toes-to-bar", "Toes to Bar", 3, "AMRAP", ?"Control down phase and swinging", #amrap),
          ],
        ),
      ];
    };
  };

  func buildDay2() : WorkoutDay {
    {
      id = 2;
      name = "Day 2";
      patterns = [
        createMovementPattern(
          "squat",
          "Squat",
          [
            createExercise("goblet-squat", "Goblet Squat", 3, "12", null, #normal),
            createExercise("barbell-high-bar-box-squat", "Barbell High Bar Box Squat", 3, "8", ?"Completely sit on box but keep torso rigid", #normal),
            createExercise("barbell-high-bar-back-squat", "Barbell High Bar Back Squat", 3, "6", null, #normal),
          ],
        ),
        createMovementPattern(
          "horizontal-press",
          "Horizontal Press",
          [
            createExercise("db-floor-press", "Dumbbell Floor Press", 3, "12", ?"Gently rest elbows on floor between reps", #normal),
            createExercise("db-bench-press", "Dumbbell Bench Press", 3, "10", null, #normal),
            createExercise("barbell-bench-press", "Barbell Bench Press", 3, "8", null, #normal),
          ],
        ),
        createMovementPattern(
          "vertical-pull",
          "Vertical Pull",
          [
            createExercise("table-top-pull-up-hold", "Table Top Pull Up Hold", 3, "30sec", ?"Keep hips drawn to ribs", #timed),
            createExercise("table-top-pull-up-negative", "Table Top Pull Up Negative", 3, "5", ?"Control down phase 4-5 seconds", #normal),
            createExercise("table-top-pull-up", "Table Top Pull Up", 3, "AMRAP", ?"Knees at least horizontal at all times", #amrap),
          ],
        ),
        createMovementPattern(
          "single-leg-thrust",
          "Single Leg Thrust",
          [
            createExercise("foot-shoulder-elevated-hip-thrust", "Foot+Shoulder Elevated Single Leg Hip Thrust", 3, "12", null, #normal),
            createExercise("db-pause-b-stance-hip-thrust", "DB Pause B Stance Hip Thrust", 3, "10", ?"Draw hips to ribs", #normal),
            createExercise("db-pause-single-leg-hip-thrust", "DB Pause Single Leg Hip Thrust", 3, "8", ?"Pause 2 seconds at lockout", #normal),
          ],
        ),
        createMovementPattern(
          "hip-adduction",
          "Hip Adduction",
          [
            createExercise("copenhagen-plank-knee", "Copenhagen Plank (knee)", 3, "30sec ea", null, #timed),
            createExercise("copenhagen-plank-foot", "Copenhagen Plank (foot)", 3, "30sec ea", null, #timed),
            createExercise("copenhagen-raise", "Copenhagen Raise", 3, "12ea", ?"Slow and controlled", #normal),
          ],
        ),
      ];
    };
  };

  func buildDay3() : WorkoutDay {
    {
      id = 3;
      name = "Day 3";
      patterns = [
        createMovementPattern(
          "split-squat",
          "Split Squat",
          [
            createExercise("barbell-split-squat", "Barbell Split Squat", 3, "10ea", null, #normal),
            createExercise("zercher-split-squat", "Zercher Split Squat", 3, "8ea", null, #normal),
            createExercise("barbell-b-stance-squat", "Barbell B Stance Squat", 3, "6ea", ?"Weight on lead leg", #normal),
          ],
        ),
        createMovementPattern(
          "bodyweight-press",
          "Bodyweight Press",
          [
            createExercise("pushup", "Pushup", 3, "AMRAP", null, #amrap),
            createExercise("decline-pushup", "Decline Pushup", 3, "AMRAP", ?"Keep hips up", #amrap),
            createExercise("handstand-pushup", "Handstand Pushup", 3, "AMRAP", null, #amrap),
          ],
        ),
        createMovementPattern(
          "horizontal-pull",
          "Horizontal Pull",
          [
            createExercise("db-row", "Dumbbell Row", 3, "12ea", null, #normal),
            createExercise("db-pause-row", "Dumbbell Pause Row", 3, "8ea", ?"Pause 2 sec with DB at hip", #normal),
            createExercise("db-tripod-row", "Dumbbell Tripod Row", 3, "10ea", null, #normal),
          ],
        ),
        createMovementPattern(
          "single-leg-hinge",
          "Single Leg Hinge",
          [
            createExercise("bw-single-leg-rdl-reach", "BW Single Leg RDL + Reach", 3, "6ea", ?"Stabilize reach position 2 sec", #normal),
            createExercise("db-braced-single-leg-rdl", "DB Braced Single Leg RDL", 3, "10ea", ?"Keep toe pointed down", #normal),
            createExercise("barbell-single-leg-rdl", "Barbell Single Leg RDL", 3, "8ea", null, #normal),
          ],
        ),
        createMovementPattern(
          "hip-abduction",
          "Hip Abduction",
          [
            createExercise("side-lying-hip-abduction", "Side Lying Hip Abduction", 3, "15ea", null, #normal),
            createExercise("extra-range-side-lying-hip-abduction", "Extra Range Side Lying Hip Abduction", 3, "12ea", null, #normal),
            createExercise("side-lying-hip-raise", "Side Lying Hip Raise", 3, "8ea", ?"Hips go up + forward, drive through bottom knee", #normal),
          ],
        ),
      ];
    };
  };

  func buildDay4() : WorkoutDay {
    {
      id = 4;
      name = "Day 4";
      patterns = [
        createMovementPattern(
          "hinge",
          "Hinge",
          [
            createExercise("conventional-block-pull", "Conventional Block Pull", 3, "8", null, #normal),
            createExercise("conventional-deadlift", "Conventional Deadlift", 3, "6", null, #normal),
            createExercise("sumo-deadlift", "Sumo Deadlift", 3, "5", null, #normal),
          ],
        ),
        createMovementPattern(
          "vertical-press",
          "Vertical Press",
          [
            createExercise("db-seated-ohp", "DB Seated Overhead Press", 3, "12", null, #normal),
            createExercise("db-standing-ohp", "DB Standing Overhead Press", 3, "10", null, #normal),
            createExercise("military-press", "Military Press", 3, "8", null, #normal),
          ],
        ),
        createMovementPattern(
          "bodyweight-row",
          "Bodyweight Row",
          [
            createExercise("inverted-row-high", "Inverted Row (high)", 3, "AMRAP", null, #amrap),
            createExercise("inverted-row-low", "Inverted Row (low)", 3, "AMRAP", null, #amrap),
            createExercise("feet-elevated-inverted-row", "Feet Elevated Inverted Row", 3, "AMRAP", null, #amrap),
          ],
        ),
        createMovementPattern(
          "split-squat",
          "Split Squat",
          [
            createExercise("bw-bulgarian-split-squat", "BW Bulgarian Split Squat", 3, "10ea", null, #normal),
            createExercise("db-bulgarian-split-squat", "DB Bulgarian Split Squat", 3, "8ea", null, #normal),
            createExercise("db-deficit-bulgarian-split-squat", "DB Deficit Bulgarian Split Squat", 3, "6ea", null, #normal),
          ],
        ),
        createMovementPattern(
          "anterior-chain",
          "Anterior Chain",
          [
            createExercise("lying-leg-raise", "Lying Leg Raise", 3, "AMRAP", ?"Keep low back pressed into ground", #amrap),
            createExercise("dragon-fly", "Dragon Fly", 3, "12", null, #normal),
            createExercise("devils-ws", "Devil's W's", 3, "8", null, #normal),
          ],
        ),
      ];
    };
  };

  let programData = buildWorkoutDays();

  ////////////////////////////////////////////////////////////
  // Public Methods
  ////////////////////////////////////////////////////////////

  public query ({ caller }) func getProgram() : async [WorkoutDay] {
    programData;
  };

  public shared ({ caller }) func logWorkout(dayId : Nat, selectedExercises : [(Text, Text)]) : async Text {
    // Validate dayId
    if (dayId < 1 or dayId > 4) {
      Runtime.trap("Invalid dayId. Must be between 1 and 4");
    };

    // Transform selectedExercises to correct format
    let convertedExercises = selectedExercises.map(
      func((patternId, exerciseId)) {
        { patternId; exerciseId };
      }
    );

    // Create new log
    let newLog : WorkoutLog = {
      id = logIdCounter.toText();
      dayId;
      completedAt = Time.now();
      selectedExercises = convertedExercises;
    };

    // Store log
    workoutLogs.add(newLog.id, newLog);
    logIdCounter += 1;
    newLog.id;
  };

  public query ({ caller }) func getWorkoutLogs() : async [WorkoutLog] {
    workoutLogs.values().toArray().sort();
  };

  public shared ({ caller }) func deleteWorkoutLog(logId : Text) : async () {
    if (not workoutLogs.containsKey(logId)) {
      Runtime.trap("Log not found");
    };
    workoutLogs.remove(logId);
  };
};
