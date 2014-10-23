using System;
using System.Diagnostics;

namespace my_code_kata
{
  partial static class my_code_kata
  {
    protected static string FindPropertyValue(Object input, string value, string output = "")
    {
        if (String.IsNullOrEmpty(output))
        {
            output = input.ToString().TrimStart('{').TrimEnd('}').Split('=')[0].Trim().Split('.').Last();
        }
        var myType = input.GetType();
        var props = myType.GetProperties();
    
        foreach (var prop in props)
        {
            // Debug.WriteLine(output + "." +prop.Name);
            Object propValue = prop.GetValue(input, null);
            object r = null;
    
            if (propValue is String || propValue is Int32 || propValue is Decimal)
            {
                if (prop.ToString() == value)
                {
                    return output + "=" + value;
                }
            } 
            else if (propValue is Array)
            {
                foreach (var item in (Array)propValue)
                {
                    r = FindPropertyValue(item, value, output + "." + prop.Name);
                }
            }
            else
            {
                if (propValue != null)
                {
                    r = FindPropertyValue(propValue, value, output + "." + prop.Name);
                }
            }
    
            if (r != null && (string) r != "")
            {
                return (string) r;
            }
        }
    
        return "";
    }
  }
}
