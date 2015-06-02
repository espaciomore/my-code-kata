using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Windows.Input;
using System.Windows.Forms;
using System.Drawing;
using Microsoft.VisualStudio.TestTools.UITesting;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.VisualStudio.TestTools.UITest.Extension;
using Keyboard = Microsoft.VisualStudio.TestTools.UITesting.Keyboard;

namespace MyCodeKata
{
    [CodedUITest]
    public class TestClassName
    {
        [TestMethod]
        [Description("Hello World description!")]
        public void Test_Method()
        {
          // define steps
        }
        
        #region Additional test attributes

        protected dynamic GetTestAttribute(Type type, string propName)
        {
            var testClass = Type.GetType(TestContext.FullyQualifiedTestClassName);
            var testMethod = testClass.GetMethod(TestContext.TestName).GetBaseDefinition();
            dynamic attributeValue = null;
            foreach (dynamic customAttribute in testMethod.GetCustomAttributes(type, false))
            {
                switch (type.Name)
                { 
                    case "DescriptionAttribute":
                        attributeValue = customAttribute.Description;
                        break;
                }
            }
            
            return attributeValue;
        }

        // You can use the following additional attributes as you write your tests:
        ////Use TestInitialize to run code before running each test 
        [TestInitialize()]
        public virtual void TestInitialize()
        {
            var description = GetTestAttribute(typeof(DescriptionAttribute), "Description");
            
            Playback.PlaybackSettings.LoggerOverrideState = HtmlLoggerState.DefaultTraceLevel;
            Playback.PlaybackSettings.MaximumRetryCount = 1;
            Playback.PlaybackSettings.SearchTimeout = 60000;
            Playback.PlaybackSettings.WaitForReadyTimeout = 60000;
            Playback.PlaybackSettings.WaitForReadyLevel = WaitForReadyLevel.Disabled;
           // Playback.Initialize();
        }

        //Use TestCleanup to run code after each test has run
        [TestCleanup()]
        public virtual void TestCleanup()
        {
            Playback.Cleanup();

            System.IO.DirectoryInfo directory = new System.IO.DirectoryInfo(BasePath + @"\TestResults");
            if (directory.Exists)
            {
                foreach (System.IO.FileInfo file in directory.GetFiles()) { try { file.Delete(); } catch (/*System.UnauthorizedAccess*/Exception) { } };
                foreach (System.IO.DirectoryInfo subDirectory in directory.GetDirectories()) { try { subDirectory.Delete(true); } catch (/*System.UnauthorizedAccess*/Exception) { } };
            }
        }

        #endregion

        // ReSharper disable once ConvertToAutoProperty
        public TestContext TestContext
        {
            get
            {
                return _testContextInstance;
            }
            set
            {
                _testContextInstance = value;
            }
        }
        private TestContext _testContextInstance;
    }
}
