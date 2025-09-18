# Description: I created this script because I wanted to download a list of mp3 files from a website
# DownloadMp3 is a function that takes the web url as a parameter then download all links containing mp3 files

function DownloadMp3 
{
  param($uri)
  $html = Invoke-WebRequest -Uri $uri
  $files = $html.ParsedHtml.getElementsByTagName("a") | where{ $_.href -like "*.mp3" }
  
  foreach($file in $files)
  {
    $destination = (".\" + $file.innerText.Replace('[', '(').Replace(']', ')').Trim())
    if(!(Test-Path $destination))
    {
      Write-Host ("Downloading file: " + $destination)
      Invoke-WebRequest $file.href -OutFile $destination
    } 
    else 
    {
      Write-Host ("File Exists: " + $destination)
    }
  }
}
