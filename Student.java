import java.util.*;

public class Student{
    String name = "Saten";
    //  static int age = 32;
    float bloodgroup = 14.5f;
   
    public static void main(String[] args) {
        Student data = new Student();
        System.out.println("My name is " + data.name);
        
        int a = 5;
        int b =8;
        if((a == b ) && (a != b)){
            System.out.println("Executed");
        } else {
            System.out.println("not executed");
        }

        // Scanner s = new Scanner(System.in);
       

        
    }
}