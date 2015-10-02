# Download all desired files from a Website

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
