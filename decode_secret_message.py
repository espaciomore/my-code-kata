# pip install lxml
# pip install cssselect

from lxml.html import parse
from lxml.html import fromstring

def decode_secret_message(url):
    doc = parse(url).getroot() # fromstring(url)
    parsedData = []
    nRow = 0
    nCol = 0

    for tbody in doc.cssselect('tbody'):
        for tr in tbody.cssselect('tr:not(:first-child)'):
            coordX = int(tr.cssselect('td:nth-child(1)')[0].text_content())
            char = tr.cssselect('td:nth-child(2)')[0].text_content()
            coordY = int(tr.cssselect('td:nth-child(3)')[0].text_content())

            if coordX > nRow:
                nRow = coordX
            if coordY > nCol:
                nCol = coordY

            parsedData.append([coordX, char.strip(), coordY])
    
    matrix = []

    for x in range(0, nRow + 1):
        matrix.append([])
        for y in range(0, nCol + 1):
            matrix[x].append('')

    for data in parsedData:
        matrix[data[0]][data[2]] = data[1]

    matrixT = [list(row) for row in zip(*matrix)]
    print(matrixT)
    for row in reversed(matrixT):
        line = "".join(row)
        print(line)

decode_secret_message("secret_message.html")