# this was run in an arcpy window, an external script needs to get the path for the hmda csv
# downloaded from http://www.consumerfinance.gov/hmda/explore

import arcpy
from collections import defaultdict

tracts = defaultdict(lambda:defaultdict(lambda:0))
cols = ['census_tract_number', 'applicant_race_name_1', 'applicant_ethnicity_name']
curs = arcpy.da.SearchCursor('hmda_lar.csv',cols)



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



for row in curs:
  proc(*row)
