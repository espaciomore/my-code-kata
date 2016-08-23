using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FASTSelenium.Common
{
    public class JSONString
    {
        private object _object;
        private string _jsonObject;
        private int _level;
        private int _maxLevel;
        private string[] _skipList;

        public JSONString(object obj, int level = 0, int maxLevel = 10, string [] skipList = null)
        {
            this._level = level;
            this._maxLevel = maxLevel;
            this._object = obj;
            if(skipList == null)
            {
                this._skipList = new string[] { "ExtensionData", "SyncRoot", "Length", "LongLength", "Rank" }; 
            }

            if (this._level > this._maxLevel)
            {
                this._jsonObject = "{}";
            }
            else
            {
                this._jsonObject = string.Format("{{{0}}}", ConvertObjectToJSON());
            }
        }

        private string ConvertObjectToJSON()
        {
            List<string> json = new List<string>();
            try
            {
                System.Reflection.PropertyInfo[] props = this._object.GetType().GetProperties(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance);
                for (int i = 0; i < props.Length; i++)
                {
                    if (this._skipList.Contains(props[i].Name))
                    {
                        continue;
                    }

                    string _object = string.Format("{0}{1}{2}: ", '"', props[i].Name, '"');
                    var value = props[i].GetValue(this._object, null);
                    if (value == null)
                    {
                        _object += "null";
                    }
                    else if (props[i].PropertyType.IsArray || value.GetType().IsArray)
                    {
                        List<string> itemList = new List<string>();
                        for (int j = 0; j < ((Array)value).Length; j++)
                        {
                            var _item = (new JSONString(((Array)value).GetValue(j), this._level + 1, this._maxLevel)).ToString();
                            itemList.Add(_item);
                        }
                        _object += string.Format("[{0}]", String.Join(",", itemList.ToArray()));
                    }
                    else if (props[i].PropertyType == typeof(String) || value.GetType() == typeof(String))
                    {
                        _object += string.Format("{0}{1}{2}", '"', value, '"');
                    }
                    else if (props[i].PropertyType == typeof(Int32) || props[i].PropertyType == typeof(Int16) || props[i].PropertyType == typeof(Decimal))
                    {
                        _object += string.Format("{0}", value);
                    }
                    else if (value.GetType() == typeof(Int32) || value.GetType() == typeof(Int16) || value.GetType() == typeof(Decimal))
                    {
                        _object += string.Format("{0}", value);
                    }
                    else if (props[i].PropertyType == typeof(Boolean) || value.GetType() == typeof(Boolean))
                    {
                        _object += string.Format("{0}", value.ToString().ToLowerInvariant());
                    }
                    else if (props[i].PropertyType == typeof(DateTime) || value.GetType() == typeof(DateTime))
                    {
                        _object += string.Format("{0}{1}{2}", '"', ((DateTime)value).ToDateString() + " " + ((DateTime)value).ToTimeString(timeZone: true), '"');
                    }
                    else
                    {
                        var _value = (new JSONString(value, this._level + 1, this._maxLevel)).ToString();
                        _object += string.Format("{0}", _value == "{}" ? "\"" + value + "\"" : _value);
                    }

                    json.Add(_object);
                }
            }
            catch
            {
                return string.Empty;
            }

            return String.Join(",", json.ToArray());
        }

        public override string ToString()
        {
            return _jsonObject;
        }
    }
}
