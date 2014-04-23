/*
 ArrayJmp - problem description

 Detailed error analysis:
 - The reason for the error on my first try was that I only considered the loop 
   as a maximum iteration of Array.Length^2, though my solution is very safe it 
   is not as efficient when considering processing or execution time.
 - My correct solution would be to have a record of visited indexes and also 
   consider both positive and negative bounderies.

 The corrected code below...
*/
using System.IO;
using System;

class Program
{
    static void Main()
    {
        int[] test4 = { 2,3,-1,1,3 };
        Console.WriteLine( solution( test4 ) == 4 );
        
        int[] testZeroLoop = { 0 };
        Console.WriteLine( solution( testZeroLoop ) == -1 );
        
        int[] testStepsLoop = { 1,1,1,-3 };
        Console.WriteLine( solution( testStepsLoop ) == -1 );
        
        int[] testSingleLoop = { 1,1,-1,1 };
        Console.WriteLine( solution( testSingleLoop ) == -1 );
        
        int[] testNegativeJump = { 1,1,-4 };
        Console.WriteLine( solution( testNegativeJump ) == 3 );
        
    }
    public static int solution(int[] A) 
    {
        // write your code in C# with .NET 2.0
        int len = A.Length;
        int[] visited = new int[len];
        if(len == 0){
            return 0;
        }
        int index = 0;
        int next = 0;
        int jumps = 0;
        while(index >= 0 && index < len){
            next  = index + A[index];
            visited[ index ] = 1;
            // for single step loops
            if( next >= 0 && next < len && visited[ next ] == 1 ){
                return -1;
            }
            index = next;
            jumps++;
        }
        
        return jumps;
    }
}
