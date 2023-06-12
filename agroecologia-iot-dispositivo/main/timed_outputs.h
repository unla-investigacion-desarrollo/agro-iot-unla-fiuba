/*
 * timed-outputs.h
 *
 *  Created on: 1 jul. 2022
 *      Author: Damian
 */

#ifndef TIMED_OUTPUTS_H_
#define TIMED_OUTPUTS_H_

#include <stdint.h>




void timedOutputsInit(void);
int timedOutputsAdd(int gpio);
void timedOutputOn(int output, uint64_t duration);





#endif /* TIMED_OUTPUTS_H_ */
