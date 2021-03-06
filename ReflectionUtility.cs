//  Taken from https://handcraftsman.wordpress.com/2008/11/11/how-to-get-c-property-names-without-magic-strings/
//
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace MyCodeKata
{
    public static class ReflectionUtility
    {
        public static string GetPropertyName<T>(Expression<Func<T>> expression)
        {
            MemberExpression body = (MemberExpression)expression.Body;
            return body.Member.Name;
        }

        public static Attribute GetPropertyAttribute<T>(Expression<Func<T>> expression)
        {
            MemberExpression body = (MemberExpression)expression.Body;
            return body.Member.GetCustomAttribute(typeof(Attribute)) as Attribute;
        }
    }
}
