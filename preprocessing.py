# this was run in an arcpy window, an external script needs to get the path for the hmda csv
# downloaded from http://www.consumerfinance.gov/hmda/explore

import arcpy
from collections import defaultdict

tracts = defaultdict(lambda:defaultdict(lambda:0))
cols = ['census_tract_number', 'applicant_race_name_1', 'applicant_ethnicity_name']



def proc (tract, race, eth):
  if eth[0] != 'H':
    if race[0:3] == "Bla":
      tracts[tract]["Black"] += 1
    elif race[0:3] == "Ame":
      tracts[tract]["American_Indian"] += 1
    elif race[0:3] == "Nat":
      tracts[tract]["Pacific_Islander"] += 1
    else:
      tracts[tract][race] +=1
  else:
    tracts[tract]["Hispanic"] +=1


with arcpy.da.SearchCursor('hmda_lar.csv',cols) as curs:
  for row in curs:
    proc(*row)




posInRow = {'American_Indian': 6, 'Hispanic': 2, 'Black': 4, 'Asian': 3, 'White': 1, 'Pacific_Islander': 5}
raceFields = ["tract","White","Hispanic","Asian","Black","Pacific_Islander","American_Indian"]

with arcpy.da.UpdateCursor('yolo_tracts', raceFields) as yolo_curs:
  for row in yolo_curs:
    tract = row[0]
    for key in tracts[tract]:
       row[posInRow[key]] = tracts[tract][key]
    yolo_curs.updateRow(row)
