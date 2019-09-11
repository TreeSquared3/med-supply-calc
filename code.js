"use strict";

var names             = document.getElementById("name");
var packageSizes      = document.getElementById("package-size");
var usagePerDay       = document.getElementById("usage-per-day");
var remainingPackages = document.getElementById("remaining-packages");
var tolerances        = document.getElementById("tolerance");

var rowCount = 0;

function addRow(_name, _packageSize, _usagePerDay, _remainingPackages, _tolerance) {
    rowCount++;

    names.innerHTML             += getInputElementTextHTML  ("name"              , _name);
    packageSizes.innerHTML      += getInputElementNumberHTML("package-size"      , _packageSize);
    usagePerDay.innerHTML       += getInputElementNumberHTML("usage-per-day"     , _usagePerDay);
    remainingPackages.innerHTML += getInputElementNumberHTML("remaining-packages", _remainingPackages);
    tolerances.innerHTML        += getInputElementNumberHTML("tolerance"         , _tolerance);

    saveValue(document.getElementById("name-"               + rowCount));
    saveValue(document.getElementById("package-size-"       + rowCount));
    saveValue(document.getElementById("usage-per-day-"      + rowCount));
    saveValue(document.getElementById("remaining-packages-" + rowCount));
    saveValue(document.getElementById("tolerance-"          + rowCount));

    restoreSavedValues();
}
function getInputElementTextHTML(_id, _value) {
    return '<input class="text-input" id="' + _id + '-' + rowCount + '" type="text" value="' + _value + '" onkeyup="saveValue(this);">\n';
}
function getInputElementNumberHTML(_id, _value) {
    return '<input class="number-input" id="' + _id + '-' + rowCount + '" type="number" min="0" step="0.01" value="' + _value + '" onkeyup="saveValue(this);">\n';
}

function removeRow() {

    if (rowCount <= 1) return;

    names.removeChild(            document.getElementById("name-"               + rowCount));
    packageSizes.removeChild(     document.getElementById("package-size-"       + rowCount));
    usagePerDay.removeChild(      document.getElementById("usage-per-day-"      + rowCount));
    remainingPackages.removeChild(document.getElementById("remaining-packages-" + rowCount));
    tolerances.removeChild(       document.getElementById("tolerance-"          + rowCount));

    removeSavedValue("name-"               + rowCount);
    removeSavedValue("package-size-"       + rowCount);
    removeSavedValue("usage-per-day-"      + rowCount);
    removeSavedValue("remaining-packages-" + rowCount);
    removeSavedValue("remaining-days-"     + rowCount);
    removeSavedValue("tolerance-"          + rowCount);

    rowCount--;

    restoreSavedValues();
}

function saveValue(e) {
    localStorage.setItem(e.id, e.value);
}

function saveAllValues() {
    var i;
    for(i=1;i<=rowCount;i++) {
        saveValue(document.getElementById("name-"               + i));
        saveValue(document.getElementById("package-size-"       + i));
        saveValue(document.getElementById("usage-per-day-"      + i));
        saveValue(document.getElementById("remaining-packages-" + i));
        saveValue(document.getElementById("tolerance-"          + i));
    }

    saveValue(document.getElementById("wanted-days-to-last-1"));
}

function getSavedValue(v) {
    if (!localStorage.getItem(v)) {
        return "";
    }
    return localStorage.getItem(v);
}

function removeSavedValue(v) {
    if (!localStorage.getItem(v)) {
        return;
    }
    return localStorage.removeItem(v);
}

function restoreSavedValues() {
    var i;
    for(i=1;i<=rowCount;i++) {
        document.getElementById("name-"               + i).value = getSavedValue("name-"               + i);
        document.getElementById("package-size-"       + i).value = getSavedValue("package-size-"       + i);
        document.getElementById("usage-per-day-"      + i).value = getSavedValue("usage-per-day-"      + i);
        document.getElementById("remaining-packages-" + i).value = getSavedValue("remaining-packages-" + i);
        document.getElementById("tolerance-"          + i).value = getSavedValue("tolerance-"          + i);
    }
}

function calculate() {
    saveAllValues();

    var i, result="";
    for(i=1;i<=rowCount;i++) {
        result += "<div><p>";

        var name              = getSavedValue("name-"               + i);
        var packageSize       = getSavedValue("package-size-"       + i);
        var usagePerDay       = getSavedValue("usage-per-day-"      + i);
        var remainingPackages = getSavedValue("remaining-packages-" + i);
        var tolerance         = getSavedValue("tolerance-"          + i);
        var wantedDaysToLast  = getSavedValue("wanted-days-to-last-1");

        result += "----------" + name + "----------<br>";

        var remainingDays = remainingPackages * packageSize / usagePerDay;

        var neededPackages = Math.max(0, (wantedDaysToLast - remainingDays) * usagePerDay / packageSize);

        var neededPackagesWithTol = neededPackages * (1 + tolerance / 100);

        result += "Remaining days: " + remainingDays.toFixed(1) + "<br>";        

        result += "Needed packages (with tolerance): " + neededPackagesWithTol.toFixed(1) + "<br>";

        result += "Needed packages (without " + tolerance + "% tolerance): " + neededPackages.toFixed(1) + "<br>";
        
        result += "</p></div>";
    }

    document.getElementById("results").innerHTML = result;
}