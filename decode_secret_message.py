# pip install lxml
# pip install cssselect

from lxml.html import parse
# from lxml.html import fromstring

def decode_secret_message(url):
    doc = parse(url).getroot() # fromstring(url)
    parsedData = []
    maxRow = 0
    maxCol = 0

    for tbody in doc.cssselect('tbody'):
        for tr in tbody.cssselect('tr:not(:first-child)'):
            coordX = int(tr.cssselect('td:nth-child(1)')[0].text_content())
            char = tr.cssselect('td:nth-child(2)')[0].text_content().strip()
            coordY = int(tr.cssselect('td:nth-child(3)')[0].text_content())

            maxRow = max(maxRow, coordX)
            maxCol = max(maxCol, coordY)

            parsedData.append([coordX, char, coordY])
    
    matrix = []

    for x in range(0, maxRow + 1):
        matrix.append([])
        for y in range(0, maxCol + 1):
            matrix[x].append('')

    for x, char, y in parsedData:
        matrix[x][y] = char

    matrixT = [list(row) for row in zip(*matrix)]
    
    for row in reversed(matrixT):
        line = "".join(row)
        print(line)

decode_secret_message("secret_message.html")