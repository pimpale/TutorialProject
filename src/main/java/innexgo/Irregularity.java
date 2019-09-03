package innexgo;

public class Irregularity {
  public int id;
  int studentId;
  int courseId;
  int periodId;
  public String type;
  public long time;
  public long timeMissing;

  // for jackson
  public Student student;
  public Course course;
  public Period period;
}
