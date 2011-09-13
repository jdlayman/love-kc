<?php

header('Content-type: text/xml'); 

$mysqli = new mysqli( 'localhost', 'jdlayman', 'temp', 'love-kc' );

if( $mysqli->connect_error )
  {
  die( 'Connect error: ' . $mysqli->connect_errno . ': ' . $mysqli->connect_error );
  }


switch( $_POST['id'] ) {
  case "gf22af3f635c38c9b":
    $region_id = 1;
    break;
    
  case "gbdd858951a06c7b0":
    $region_id = 2;
    break;
    
  case "3":
    $region_id = 3;
    break;

  default:
    break;
}

$query = 'SELECT orgs.id,orgs.name,orgs.street_address,orgs.city,orgs.state,orgs.zip FROM orgs_to_regions JOIN orgs ON (orgs_to_regions.org_id = orgs.id) WHERE orgs_to_regions.region_id = \'' . $region_id . '\'';

$result = $mysqli->query( $query );

echo '<xml>';
while( $row = $result->fetch_row() )
  {
  echo '<entry>';
  echo '<name>' . $row[1] . '</name>';
  echo '<street_address>' . $row[2] . '</street_address>';
  echo '<city>' . $row[3] . '</city>';
  echo '<state>' . $row[4] . '</state>';
  echo '<zip>' . $row[5] . '</zip>';
  echo '</entry>';
  }
echo '</xml>';
?>
