DolphinDB

Before you install and use DolphinDB, you must read and agree to the included
license agreements: DolphinDB_Evaluation_License_Agreement.pdf and
Third_Party_Software_License.txt.

Start Server

1) Please decompress the downloaded package to a destination folder (e.g.,
/DolphinDB). Please retain the original folder structure.

2) Go to the server folder to execute dolphindb to start the server. For
example, we can start DolphinDB with the following command line:

  ./dolphindb -maxMemSize 16
   
Please make sure you have dolphindb.cfg (the configuration file),
dolphindb.dos (starting script file), dolphindb.lic (the license file), and
dolphindb (the executable) in the same directory.

DolphinDB can be used on a single machine or in a cluster. For details about
configuration, please refer to

http://www.dolphindb.com/help/ClusterSetup.html

Trouble Shooting

If DolphinDB server fails to start, you can find the description of the problem
in dolphindb.log. In many cases it involves one of the following issues:  (1)
Expired license file. (2) The port is occupied by another DolphinDB instance or
another application. (3) DolphinDB license file or starting script file
(dolphindb.dos) is missing from the home directory (specified by the command
line parameter -home) or the working directory.

The online manual is at http://www.dolphindb.com/help/

Note: dolphindb may be occasionally quarantined by antivirus software. If so,
please add dolphindb to your antivirus software exception list.

Should you have any questions or comments, please contact the DolphinDB team:
support@dolphindb.com



