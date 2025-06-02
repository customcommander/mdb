def early_set:
  .set
  | in({"2ed":true,
        "arn":true,
        "atq":true,
        "leg":true,
        "drk":true,
        "fem":true,
        "4ed":true,
        "ice":true,
        "chr":true,
        "hml":true,
        "all":true,
        "mir":true,
        "vis":true,
        "5ed":true,
        "wth":true,
        "tmp":true});

def sym_to_name:
  if   . == "B" then "black"
  elif . == "U" then "blue"
  elif . == "R" then "red"
  elif . == "W" then "white"
  elif . == "G" then "green"
  elif . == "X" then "variable"
                else "colorless" end;

def is_sym_color:
  if   . == "B" then true
  elif . == "U" then true
  elif . == "R" then true
  elif . == "W" then true
  elif . == "G" then true
                else false end;

def parse_mana_cost:
  [scan("\\{([0-9A-Z]+)\\}") | .[0]];

def compute_color:
  .mana_cost
  | parse_mana_cost
  | unique
  | map(select(is_sym_color));

def compute_mana_cost:
  .mana_cost
  | parse_mana_cost
  | group_by(.)
  | map({(.[0] | sym_to_name): (if .[0] | is_sym_color then
                                  length
                                elif .[0] == "X" then
                                  true
                                else
                                  .[0] | tonumber
                                end)})
  | add;

def scan_pt: [scan("([0-9*]+)") | .[0]];

def compute_pt:
  if . != null then
    scan_pt
    | map((if . == "*" then {variable: true} else {value: tonumber} end))
    | add
  end;

def generate_card: {
    id: .oracle_id,
    name,
    colors: (.colors | map(sym_to_name)),
    mana_cost: compute_mana_cost,
    types: (.type_line | [scan("[^—\\s]+")]),
    keywords,
    power: (.power | compute_pt),
    toughness: (.toughness | compute_pt),
    text: .oracle_text,
    image: .image_uris.normal
};

  map(select(early_set) | generate_card)
| group_by(.id)
| map(.[0])

